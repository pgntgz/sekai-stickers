import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 界面多语言词条
const resources = {
  zh: {
    translation: {
      "app_title": "PJSK表情包在线生成器",
      "banner_text": "世界计划贴纸 App 即将推出！",
      "learn_more": "了解更多",
      "total_stickers": "已制作贴纸数：",
      "not_available": "无法获取",
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
      "total_stickers_made": "本站累计生成贴纸总数：",
      "sticker_unit": " 个贴纸",
      "close": "关闭",
      
      // 贡献者描述翻译
      "contrib_ayaka": "最初的创意来源",
      "contrib_modder": "协助核心代码编写",
      "contrib_sheren": "提供初代表情包资源",
      "contrib_contributors": "协助核心代码编写",
      "contrib_pgntgz_1": "1. 增加新贴图",
      "contrib_pgntgz_2": "2. 维护及现代化重构本站",
      "link_original_code": "原作者开源仓库",
      "link_fork_code": "pgntgz 的独立定制主仓库",
      "bot_slogan": "为您的服务器增添更多乐趣",
      
      // 字体翻译
      "sticker_font": "贴纸字体：",
      "font_yuruka": "Yuruka二次元",
      "font_tangtang": "唐糖体",
      "font_huangyou": "黄油体",
      "font_kuaile": "快乐体",
      "font_brush": "狂草毛笔",
      "font_system": "系统黑体"
    }
  },
  en: {
    translation: {
      "app_title": "Project Sekai Stickers Maker",
      "banner_text": "New Sekai Stickers mobile app is coming soon",
      "learn_more": "Learn more",
      "total_stickers": "Total Stickers you made: ",
      "not_available": "Not available",
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
      "total_stickers_made": "Total stickers made using the app:",
      "sticker_unit": " Stickers",
      "close": "Close",

      // 贡献者描述翻译
      "contrib_ayaka": "for the original idea",
      "contrib_modder": "for the help with the code",
      "contrib_sheren": "for the original stamps",
      "contrib_contributors": "for the help with the code",
      "contrib_pgntgz_1": "1. Added new stickers",
      "contrib_pgntgz_2": "2. Maintained and modernized this site",
      "link_original_code": "Original Source Code",
      "link_fork_code": "Fork & Rebrand by pgntgz",
      "bot_slogan": "Add more fun to your server.",

      // 字体翻译
      "sticker_font": "Sticker Font: ",
      "font_yuruka": "Yuruka Std",
      "font_tangtang": "TangTang",
      "font_huangyou": "HuangYou",
      "font_kuaile": "KuaiLe",
      "font_brush": "Brush",
      "font_system": "System Sans"
    }
  },
  ja: {
    translation: {
      "app_title": "プロセカスタンプメーカー",
      "banner_text": "プロセカスタンプのモバイルアプリが間もなくリリースされます！",
      "learn_more": "詳細はこちら",
      "total_stickers": "作成されたスタンプの総数：",
      "not_available": "取得不可",
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
      "made_possible_by": "このツールは以下の方々の協力により実現しました：",
      "source_code_contrib": "ソースコードの確認や貢献はこちらから：",
      "discord_bot": "Discord ボット：",
      "total_stickers_made": "アプリで作成されたスタンプの総数：",
      "sticker_unit": " スタンプ",
      "close": "閉じる",

      // 贡献者描述翻译
      "contrib_ayaka": "オリジナルの発案・企画",
      "contrib_modder": "コアコード開発への協力",
      "contrib_sheren": "初期スタンプ素材の提供",
      "contrib_contributors": "コアコード開発への協力",
      "contrib_pgntgz_1": "1. 新規スタンプの追加",
      "contrib_pgntgz_2": "2. サイトのメンテナンスおよび近代化",
      "link_original_code": "オリジナルソースコード",
      "link_fork_code": "pgntgz によるカスタムフォーク主倉庫",
      "bot_slogan": "サーバーにさらに楽しさをプラス",

      // 字体翻译
      "sticker_font": "スタンプフォント：",
      "font_yuruka": "ゆるか二次元",
      "font_tangtang": "唐糖体",
      "font_huangyou": "黄油体",
      "font_kuaile": "快乐体",
      "font_brush": "毛筆ブラシ",
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
