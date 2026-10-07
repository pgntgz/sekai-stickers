import json, urllib.request, os, re, glob, time
from PIL import Image
import numpy as np
from concurrent.futures import ThreadPoolExecutor

SLUG_MAP = {
    'ichika': 1, 'saki': 2, 'honami': 3, 'shiho': 4,
    'minori': 5, 'haruka': 6, 'airi': 7, 'shizuku': 8,
    'kohane': 9, 'an': 10, 'akito': 11, 'touya': 12,
    'tsukasa': 13, 'emu': 14, 'nene': 15, 'rui': 16,
    'kanade': 17, 'mafuyu': 18, 'ena': 19, 'mizuki': 20,
    'miku': 21, 'rin': 22, 'len': 23, 'luka': 24,
    'meiko': 25, 'kaito': 26
}

CACHE_DIR = '.cache_stamps'
os.makedirs(CACHE_DIR, exist_ok=True)

with open(f'{CACHE_DIR}/stamps.json') as f:
    master_raw = json.load(f)

master_stamps = {s['assetbundleName'].capitalize(): s['name'].replace('[スタンプ]', '').split('：')[-1] for s in master_raw}

def download_stamp(b):
    fn = f'{b}.png'
    p = f'{CACHE_DIR}/{fn}'
    if os.path.exists(p) and os.path.getsize(p) > 1000:
        return fn, True
    url = f'https://sekaipedia.org/wiki/Special:FilePath/{fn}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r, open(p, 'wb') as f:
            f.write(r.read())
        return fn, True
    except Exception as e:
        return fn, False

def process_character(slug):
    cid = SLUG_MAP[slug.lower()]
    char_stamps = [s['assetbundleName'].capitalize() for s in master_raw if s.get('characterId1') == cid]
    
    # Download all candidate stamps for this character
    with ThreadPoolExecutor(max_workers=8) as ex:
        list(ex.map(download_stamp, char_stamps))
        
    stamps_half = []
    for b in char_stamps:
        p = f'{CACHE_DIR}/{b}.png'
        if os.path.exists(p):
            im = Image.open(p).convert('RGBA')
            im_h = im.resize((im.size[0]//2, im.size[1]//2), Image.Resampling.BOX)
            stamps_half.append((b, np.array(im_h)))
            
    # Find manual stickers in repo
    repo_files = sorted(glob.glob(f'public/img/{slug}/*.png') + glob.glob(f'public/img/{slug.capitalize()}/*.png') + glob.glob(f'public/img/{slug.lower()}/*.png'))
    repo_files = list(dict.fromkeys(repo_files))
    manual_files = [f for f in repo_files if re.match(r'^[A-Za-z]+_\d+\.png$', os.path.basename(f))]
    
    matches = {}
    for rf in manual_files:
        fn = os.path.basename(rf)
        t_img = Image.open(rf).convert('RGBA')
        t_w, t_h = t_img.size
        t_half = np.array(t_img.resize((t_w//2, t_h//2), Image.Resampling.BOX))
        th_h, th_w = t_half.shape[:2]
        th_alpha = t_half[:, :, 3] > 100
        
        best_name = None
        min_mae = 999999
        for s_name, s_half in stamps_half:
            sh_h, sh_w = s_half.shape[:2]
            max_h = max(sh_h, th_h)
            max_w = max(sh_w, th_w)
            s_pad = np.zeros((max_h, max_w, 4), dtype=np.uint8)
            s_pad[:sh_h, :sh_w] = s_half
            
            for dy in range(0, max_h - th_h + 1, 1):
                for dx in range(0, max_w - th_w + 1, 1):
                    sub = s_pad[dy:dy+th_h, dx:dx+th_w]
                    overlap = th_alpha & (sub[:, :, 3] > 100)
                    if np.sum(overlap) < 0.4 * np.sum(th_alpha):
                        continue
                    mae = np.mean(np.abs(t_half[overlap, :3].astype(float) - sub[overlap, :3].astype(float)))
                    if mae < min_mae:
                        min_mae = mae
                        best_name = s_name
        txt = master_stamps.get(best_name, 'something')
        matches[fn] = (best_name, min_mae, txt)
        print(f'  [{slug}] {fn:<16} -> {str(best_name):<12} (MAE={min_mae:5.2f}): {txt}')
    return matches

def main():
    # Load characters.json
    with open('src/characters.json', 'r', encoding='utf-8') as f:
        chars = json.load(f)

    # 20 remaining characters
    remaining = [
        'ichika', 'saki', 'honami', 'shiho',
        'minori', 'haruka', 'shizuku',
        'kohane', 'an', 'akito', 'touya',
        'emu', 'nene', 'rui',
        'miku', 'rin', 'len', 'luka', 'meiko', 'kaito'
    ]

    total_updated = 0
    start_all = time.time()

    for idx, slug in enumerate(remaining, 1):
        print(f'\n[{idx}/{len(remaining)}] Processing {slug}...')
        t0 = time.time()
        res = process_character(slug)
        
        # Apply to chars
        updated_for_char = 0
        for c in chars:
            fn = c['img'].split('/')[-1]
            if fn in res:
                matched_name, mae, txt = res[fn]
                if txt and txt != 'Unknown' and txt != 'something':
                    c['defaultText']['text'] = txt
                    updated_for_char += 1
                    
        total_updated += updated_for_char
        print(f'Done {slug}: {updated_for_char} stickers updated in {time.time()-t0:.1f}s')

        # Save progress after each character
        with open('src/characters.json', 'w', encoding='utf-8') as f:
            json.dump(chars, f, indent=2, ensure_ascii=False)
            f.write('\n')

    print(f'\n========================================')
    print(f'ALL DONE! Total updated: {total_updated} in {time.time()-start_all:.1f}s')
    print(f'========================================')

if __name__ == '__main__':
    main()
