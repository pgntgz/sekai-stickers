import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 界面多语言词条
const resources = {
  zh: {
    translation: {
      "app_title": "PJSK表情包在线生成器",
      "rotate": "旋转：",
      "font_size": "字号大小：",
      "spacing": "字间距：",
      "curve": "文本弯曲 (Beta)：",
      "text_label": "自定义文本",
      "pick_character": "选择角色",
      "copy": "复制",
      "download": "下载",
      "search_placeholder": "搜索角色...",
      "info": "信息",
      "info_title": "关于本站",
      "made_possible_by": "本站的诞生离不开以下贡献：",
      "source_code_contrib": "你可以在这里查看源码或参与贡献：",
      "discord_bot": "Discord 机器人：",
      "close": "关闭",
      
      // 贡献者描述翻译
      "contrib_ayaka": "最初的创意来源",
      "contrib_modder": "协助核心代码编写",
      "contrib_sheren": "提供初代表情包资源",
      "contrib_contributors": "协助核心代码编写",
      "contrib_antigravity": "全栈架构现代化与敏捷重构 (AI Agent)",
      "contrib_chouxiang": "提供趣味中文抽象段子源支持",
      "contrib_pgntgz_1": "1. 增加新贴图",
      "contrib_pgntgz_2": "2. 维护及现代化重构本站",
      "link_original_code": "原作者开源仓库",
      "link_fork_code": "pgntgz 的独立定制主仓库",
      "bot_slogan": "为您的服务器增添更多乐趣",
      "random_quote": "抽象灵感",
      "reset_text": "恢复",
      "settings_title": "控制中心",
      "canvas_title": "贴纸画布",
      "text_color": "文字颜色",
      "color_palette": "角色代表色盘",
      "free_color_picker": "自由调色盘",
      "reset_char_color": "恢复当前角色色",
      
      // 字体翻译
      "sticker_font": "贴纸字体：",
      "font_yuruka": "日服原版 (Yuruka/缺简中)",
      "font_tangtang": "唐糖体",
      "font_huangyou": "黄油体",
      "font_kuaile": "可爱圆体 (推荐/全字库)",
      "font_brush": "狂草毛笔",
      "font_loli": "陈宇萝莉体",
      "font_dela": "Dela爆裂海报",
      "font_mochiy": "Mochiy圆滚",
      "font_pixel": "8Bit像素",
      "font_wqy": "文泉驿圆体 (标准)",
      "font_system": "系统黑体"
    }
  },
  en: {
    translation: {
      "app_title": "Project Sekai Stickers Maker",
      "rotate": "Rotate: ",
      "font_size": "Font size: ",
      "spacing": "Spacing: ",
      "curve": "Curve (Beta): ",
      "text_label": "Text",
      "pick_character": "PICK CHARACTER",
      "copy": "COPY",
      "download": "DOWNLOAD",
      "search_placeholder": "Search character...",
      "info": "INFO",
      "info_title": "Info",
      "made_possible_by": "This tool made possible by:",
      "source_code_contrib": "You can find the source code or contribute here:",
      "discord_bot": "The discord bot:",
      "close": "Close",

      // 贡献者描述翻译
      "contrib_ayaka": "for the original idea",
      "contrib_modder": "for the help with the code",
      "contrib_sheren": "for the original stamps",
      "contrib_contributors": "for the help with the code",
      "contrib_antigravity": "for full-stack architecture rebuild & AI agent pairing",
      "contrib_chouxiang": "for providing the humorous Chinese meme quotes API",
      "contrib_pgntgz_1": "1. Added new stickers",
      "contrib_pgntgz_2": "2. Maintained and modernized this site",
      "link_original_code": "Original Source Code",
      "link_fork_code": "Fork & Rebrand by pgntgz",
      "bot_slogan": "Add more fun to your server.",
      "random_quote": "Random Quote",
      "reset_text": "Reset",
      "settings_title": "Controls",
      "canvas_title": "Canvas Stage",
      "text_color": "Text Color",
      "color_palette": "Character Palette",
      "free_color_picker": "Custom Color",
      "reset_char_color": "Reset to Character Color",

      // 字体翻译
      "sticker_font": "Sticker Font: ",
      "font_yuruka": "JP Original (Yuruka Std)",
      "font_tangtang": "TangTang",
      "font_huangyou": "HuangYou",
      "font_kuaile": "Cute Round (Full CJK)",
      "font_brush": "Brush",
      "font_loli": "Loli Type v2",
      "font_dela": "Dela Poster",
      "font_mochiy": "Mochiy Round",
      "font_pixel": "8Bit Pixel",
      "font_wqy": "WenQuanYi Zen (Standard)",
      "font_system": "System Sans"
    }
  },
  ja: {
    translation: {
      "app_title": "プロセカスタンプメーカー",
      "rotate": "回転：",
      "font_size": "文字サイズ：",
      "spacing": "文字間隔：",
      "curve": "テキスト湾曲 (Beta)：",
      "text_label": "テキスト入力",
      "pick_character": "キャラクターを選択",
      "copy": "コピー",
      "download": "ダウンロード",
      "search_placeholder": "キャラクターを検索...",
      "info": "情報",
      "info_title": "情報",
      "made_possible_by": "このツールは以下の方々の協力により实现しました：",
      "source_code_contrib": "ソースコードの確認や貢献はこちらから：",
      "discord_bot": "Discord ボット：",
      "close": "閉じる",

      // 贡献者描述翻译
      "contrib_ayaka": "オリジナルの発案・企画",
      "contrib_modder": "コアコード開発への協力",
      "contrib_sheren": "初期スタンプ素材の提供",
      "contrib_contributors": "コアコード開発への協力",
      "contrib_antigravity": "フルスタック近代化とAIエージェント開発支援",
      "contrib_chouxiang": "面白い中国語ネタ文章データ源の提供",
      "contrib_pgntgz_1": "1. 新規スタンプの追加",
      "contrib_pgntgz_2": "2. サイトのメンテナンスおよび近代化",
      "link_original_code": "オリジナルソースコード",
      "link_fork_code": "pgntgz によるカスタムフォーク主倉庫",
      "bot_slogan": "サーバーにさらに楽しさをプラス",
      "random_quote": "ネタ文章",
      "reset_text": "リセット",
      "settings_title": "コントロール",
      "canvas_title": "スタンプ画面",
      "text_color": "文字の色",
      "color_palette": "キャラパレット",
      "free_color_picker": "自由カラーピッカー",
      "reset_char_color": "キャラの既定色に戻す",

      // 字体翻译
      "sticker_font": "スタンプフォント：",
      "font_yuruka": "JP公式スタンプ (ゆる文字)",
      "font_tangtang": "唐糖体",
      "font_huangyou": "黄油体",
      "font_kuaile": "可爱圆体 (推荐/全字库)",
      "font_brush": "毛筆ブラシ",
      "font_loli": "ロリ体V2",
      "font_dela": "デラゴシック",
      "font_mochiy": "モチポップ",
      "font_pixel": "ドットゴシック",
      "font_wqy": "文泉円体 (標準)",
      "font_system": "システム"
    }
  }
};

// 尝试根据浏览器语言或本地存储自动检测语言
const savedLng = localStorage.getItem('pjsk_lang');
const browserLng = navigator.language.split('-')[0];
const defaultLng = savedLng || (['zh', 'en', 'ja'].includes(browserLng) ? browserLng : 'zh');

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLng,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
