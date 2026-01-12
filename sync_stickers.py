import json
import os
import shutil
import re

# Master，这里是新贴图存放的绝对路径，请确认一下
SOURCE_ROOT = "/home/pgntgz/文档/贴纸"

# 这里是项目里的路径
PROJECT_IMG_ROOT = "public/img"
JSON_PATH = "src/characters.json"

# Master... 这是我整理的“点名册”映射表
# 左边是 Master 文件夹里的名字关键词，右边是项目里用的代号和颜色
# 我参考了 Master 发给我的 JSON 文件来确定颜色和文件夹大小写
CHAR_MAP = {
    "Shinonome Ena":    {"code": "ena",    "color": "#B18F6C"},
    "Yoisaki Kanade":   {"code": "Kanade", "color": "#BB6688"},
    "Akiyama Mizuki":   {"code": "Mizuki", "color": "#CA8DB6"},
    "Asahina Mafuyu":   {"code": "Mafuyu", "color": "#7171AF"},
    "Hinomori Shiho":   {"code": "Shiho",  "color": "#A0C10B"},
    "Tenma Saki":       {"code": "Saki",   "color": "#F5B303"},
    "Mochizuki Honami": {"code": "Honami", "color": "#F86666"},
    "Hoshino Ichika":   {"code": "Ichika", "color": "#33AAEE"},
    "Hanasato Minori":  {"code": "Minori", "color": "#F39E7D"},
    "Hinomori Shizuku": {"code": "Shizuku","color": "#5CD0B9"},
    "Momoi Airi":       {"code": "airi",   "color": "#FB8AAC"}, # 注意 JSON 里是小写 airi
    "Kiritani Haruka":  {"code": "Haruka", "color": "#6495F0"},
    "Hatsune Miku":     {"code": "Miku",   "color": "#33CCBB"},
    "Kagamine Len":     {"code": "Len",    "color": "#D3BD00"},
    "Kagamine Rin":     {"code": "Rin",    "color": "#E8A505"},
    "Megurine Luk":     {"code": "Luka",   "color": "#F88CA7"}, # 文件夹叫 Megurine Luk
    "KAITO":            {"code": "KAITO",  "color": "#3366CC"},
    "MEIKO":            {"code": "Meiko",  "color": "#E4485F"}, # 文件夹是 MEIKO，但 JSON 用 Meiko
    "Shiraishi An":     {"code": "an",     "color": "#00BADC"}, # 小写 an
    "Shinonome Akito":  {"code": "akito",  "color": "#FF7722"}, # 小写 akito
    "Aoyagi Toya":      {"code": "Touya",  "color": "#0077DD"}, # 文件夹 Toya, JSON Touya
    "Azusawa Kohane":   {"code": "Kohane", "color": "#FF6699"},
    "Kusanagi Nene":    {"code": "Nene",   "color": "#19CD94"},
    "Otori Emu":        {"code": "emu",    "color": "#FF66BB"}, # 小写 emu
    "Kamishiro Rui":    {"code": "Rui",    "color": "#BB88EE"},
    "Tenma Tsukasa":    {"code": "Tsukasa","color": "#F09A04"}
}

def load_existing_data():
    if not os.path.exists(JSON_PATH):
        print("Master... 找不到 characters.json，请确认你在项目根目录哦。")
        return [], 0

    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 找到当前最大的 ID，防止重复
    max_id = 0
    for item in data:
        try:
            curr_id = int(item['id'])
            if curr_id > max_id:
                max_id = curr_id
        except:
            pass
    return data, max_id

def main():
    print("Kanade: 正在准备搬运贴纸......")

    data, current_id = load_existing_data()
    if not data:
        return

    # 备份一下原来的 JSON，以防万一
    shutil.copy(JSON_PATH, JSON_PATH + ".bak")
    print("Kanade: 已备份原有的 characters.json。")

    added_count = 0

    # 遍历来源目录
    for root, dirs, files in os.walk(SOURCE_ROOT):
        # 检查当前文件夹是不是我们要找的角色文件夹
        target_char_info = None
        for folder_key in CHAR_MAP:
            if folder_key in os.path.basename(root):
                target_char_info = CHAR_MAP[folder_key]
                break

        if not target_char_info:
            continue

        char_code = target_char_info['code']
        char_color = target_char_info['color']

        # 目标存放目录
        dest_dir = os.path.join(PROJECT_IMG_ROOT, char_code)
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)

        # 过滤文件，只处理直接在该目录下的 png/jpg，忽略 cc/magic 子文件夹
        # Master 说原来的结构里混杂了 cc 文件夹，这里我们只取 root 下的文件
        # 或者如果有必要，也可以递归取，这里我只取 output_magic 里的 png 或者根目录的 png

        valid_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]

        for filename in valid_files:
            # 检查这个图片是不是已经在 JSON 里注册过了（避免重复添加）
            # 简单的检查方法：看 img 路径是否已存在
            expected_rel_path = f"{char_code}/{filename}"

            is_exist = False
            for item in data:
                if item['img'] == expected_rel_path:
                    is_exist = True
                    break

            if is_exist:
                print(f"跳过已存在: {filename}")
                continue

            # 开始搬运
            src_file = os.path.join(root, filename)
            dst_file = os.path.join(dest_dir, filename)

            try:
                shutil.copy2(src_file, dst_file)
            except Exception as e:
                print(f"Master... 复制出错: {e}")
                continue

            # 注册到 JSON
            current_id += 1
            new_entry = {
                "id": str(current_id),
                "name": f"{char_code} {current_id}", # 简单的命名
                "character": char_code,
                "img": expected_rel_path,
                "color": char_color,
                "defaultText": {
                    "text": "New Sticker", # Master 可以在网页里自己改
                    "x": 148,
                    "y": 58,
                    "r": -2,
                    "s": 47
                }
            }
            data.append(new_entry)
            added_count += 1
            print(f"已添加: {char_code} -> {filename}")

    # 保存新的 JSON
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

    print(f"\nKanade: 完成啦，Master。一共添加了 {added_count} 张新贴纸。")
    print("Kanade: 接下来请运行 Docker 命令来启动吧~")

if __name__ == "__main__":
    main()
