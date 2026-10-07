import "./App.css";
import Canvas from "./components/Canvas";
import { useState, useEffect, useRef, useMemo } from "react";
import characters from "./characters.json";
import characterColors from "./characterColors.json";
import EditableNumberTag from "./components/EditableNumberTag";
import ColorPickerModal from "./components/ColorPickerModal";
import Info from "./components/Info";
import { useTranslation } from "react-i18next";
import { getRandomQuote, prefetchQuotes, smartBreakText } from "./utils/quotes";
import { setColorScheme, setTheme } from "mdui";

// MD3 / Material Icons SVG Fallbacks
const IconDice = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="8" cy="8" r="1.2" fill="currentColor" />
    <circle cx="16" cy="8" r="1.2" fill="currentColor" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    <circle cx="8" cy="16" r="1.2" fill="currentColor" />
    <circle cx="16" cy="16" r="1.2" fill="currentColor" />
  </svg>
);

const IconPrev = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconNext = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconReset = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const IconCopy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconPalette = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const SekaiDiamond = () => (
  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ color: "var(--pjsk-color-primary)", marginRight: 6 }}>
    <polygon points="8,0 16,8 8,16 0,8" />
  </svg>
);

// 建立 slug -> characterColors 字典
const CHAR_MAP = {};
for (const item of characterColors) {
  CHAR_MAP[item.slug.toLowerCase()] = item;
}

// 758张贴纸绑定原始索引与所属组合
const STICKERS_WITH_META = characters.map((c, idx) => {
  const meta = CHAR_MAP[c.character?.toLowerCase()] || {};
  return {
    ...c,
    originalIndex: idx,
    unit: meta.unit || "Other",
    nameJa: meta.nameJa || c.name,
    nameZh: meta.nameZh || c.name,
    nameEn: meta.nameEn || c.character,
    charColor: meta.color || c.color || "#33CCBB",
    charImg: meta.img || c.img,
    charAvatar: meta.avatar || `avatars/${(meta.slug || c.character).toLowerCase()}.png`,
  };
});

const SYSTEM_FALLBACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", "Noto Sans SC", sans-serif';

const STICKER_FONTS = [
  { id: "kuaile", label: "font_kuaile", fontFamily: `'ZCOOL KuaiLe', ${SYSTEM_FALLBACK}` },
  { id: "wqy", label: "font_wqy", fontFamily: `'WenQuanYi Zen Hei', 'WenQuanYi Micro Hei', 'Noto Sans SC', ${SYSTEM_FALLBACK}` },
  { id: "yuruka", label: "font_yuruka", fontFamily: `'YurukaStd', ${SYSTEM_FALLBACK}` },
  { id: "dela", label: "font_dela", fontFamily: `'Dela Gothic One', ${SYSTEM_FALLBACK}` },
  { id: "mochiy", label: "font_mochiy", fontFamily: `'Mochiy Pop One', ${SYSTEM_FALLBACK}` },
  { id: "pixel", label: "font_pixel", fontFamily: `'DotGothic16', ${SYSTEM_FALLBACK}` },
  { id: "huangyou", label: "font_huangyou", fontFamily: `'ZCOOL QingKe HuangYou', ${SYSTEM_FALLBACK}` },
  { id: "brush", label: "font_brush", fontFamily: `'Ma Shan Zheng', ${SYSTEM_FALLBACK}` },
  { id: "system", label: "font_system", fontFamily: SYSTEM_FALLBACK },
  { id: "tangtang", label: "font_tangtang", fontFamily: `'SSFangTangTi', 'ShangShouFangTangTi', ${SYSTEM_FALLBACK}` },
];

const PRESET_QUICK_COLORS = [
  { label: "Sekai青", color: "#33CCBB" },
  { label: "纯白", color: "#FFFFFF" },
  { label: "极黑", color: "#1C1E21" },
  { label: "活力橙", color: "#FF7722" },
  { label: "蜜桃粉", color: "#FB8AAC" },
  { label: "琉璃蓝", color: "#33AAEE" },
  { label: "柠檬黄", color: "#F5B303" },
  { label: "罗兰紫", color: "#BB88EE" },
];

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("pjsk_lang", lng);
  };

  // 贴纸字体
  const [stickerFont, setStickerFont] = useState(
    localStorage.getItem("pjsk_font") || "kuaile"
  );
  const handleFontChange = (fontId) => {
    setStickerFont(fontId);
    localStorage.setItem("pjsk_font", fontId);
    setFontLoadedVersion((v) => v + 1);
  };
  const currentFontFamily =
    STICKER_FONTS.find((f) => f.id === stickerFont)?.fontFamily ||
    STICKER_FONTS[0].fontFamily;

  const [fontLoadedVersion, setFontLoadedVersion] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);

  // 动态主题模式：默认使用用户桌面的最爱青色 #59dbc1；开启后随当前角色代表色动态染色
  const [dynamicTheme, setDynamicTheme] = useState(() => {
    return localStorage.getItem("pjsk_dynamic_theme") === "true";
  });

  const [character, setCharacter] = useState(49); // 初始默认 Emu 13 (わーいわーい！)
  const activeSticker = STICKERS_WITH_META[character] || STICKERS_WITH_META[0];

  // 动态主题联动：当角色切换或开关切换时调用 MDUI 的 setColorScheme
  useEffect(() => {
    if (dynamicTheme && activeSticker?.charColor) {
      setColorScheme(activeSticker.charColor);
    } else {
      setColorScheme("#59dbc1"); // 用户桌面 matugen 最爱青色
    }
    setTheme("dark");
  }, [dynamicTheme, character, activeSticker]);

  const toggleDynamicTheme = () => {
    setDynamicTheme((prev) => {
      const next = !prev;
      localStorage.setItem("pjsk_dynamic_theme", String(next));
      return next;
    });
  };

  // 文案历史与撤销队列
  const [history, setHistory] = useState(() => {
    const init = smartBreakText(characters[49].defaultText.text || "わーいわーい！");
    return [init];
  });
  const [historyIndex, setHistoryIndex] = useState(0);
  const text = history[historyIndex] !== undefined ? history[historyIndex] : "";

  useEffect(() => {
    prefetchQuotes();
  }, []);

  const handleTextChange = (newVal) => {
    setHistory((prev) => {
      const next = [...prev];
      next[historyIndex] = newVal;
      return next;
    });
    if (newVal.includes("\n") && spaceSize < 24) {
      setSpaceSize(Math.round(fontSize * 1.15));
    }
  };

  const handleRandomQuote = () => {
    const raw = getRandomQuote();
    if (raw) {
      const formatted = smartBreakText(raw);
      setHistory((prev) => {
        const next = [...prev.slice(0, historyIndex + 1), formatted];
        return next.slice(-30);
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 29));

      if (formatted.includes("\n")) {
        const longest = Math.max(...formatted.split("\n").map((l) => l.length));
        const targetFont = longest >= 8 ? 28 : 32;
        setFontSize(targetFont);
        setSpaceSize(Math.round(targetFont * 1.18));
      } else {
        const targetFont = formatted.length >= 8 ? 32 : 36;
        setFontSize(targetFont);
        setSpaceSize(Math.round(targetFont * 1.18));
      }
    }
  };

  const handlePrevQuote = () => {
    if (historyIndex > 0) {
      setHistoryIndex((idx) => idx - 1);
    }
  };

  const handleNextQuote = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((idx) => idx + 1);
    }
  };

  const handleResetText = () => {
    const defT = characters[character].defaultText.text;
    const defS = characters[character].defaultText.s;
    const targetS = Math.min(defS, 36);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), defT].slice(-30));
    setHistoryIndex((prev) => Math.min(prev + 1, 29));
    setPosition({
      x: characters[character].defaultText.x,
      y: characters[character].defaultText.y,
    });
    setRotate(characters[character].defaultText.r);
    setFontSize(targetS);
    setSpaceSize(Math.round(targetS * 1.18));
    setTextColor(characters[character].color);
  };

  const handleSelectSticker = (newIndex) => {
    setCharacter(newIndex);
    const newChar = characters[newIndex];
    if (newChar) {
      const meta = CHAR_MAP[newChar.character?.toLowerCase()];
      const repColor = newChar.color || meta?.color || "#FB8AAC";
      setTextColor(repColor);

      if (newChar.defaultText) {
        setPosition({
          x: newChar.defaultText.x,
          y: newChar.defaultText.y,
        });
        setRotate(newChar.defaultText.r);
      }
    }
  };

  const [position, setPosition] = useState({
    x: characters[character].defaultText.x,
    y: characters[character].defaultText.y,
  });
  const [fontSize, setFontSize] = useState(() => {
    const isMulti = history[0] && history[0].includes("\n");
    if (isMulti) {
      const longest = Math.max(...history[0].split("\n").map((l) => l.length));
      return longest >= 8 ? 28 : 32;
    }
    return (history[0] && history[0].length >= 8) ? 32 : 36;
  });
  const [spaceSize, setSpaceSize] = useState(() => {
    const isMulti = history[0] && history[0].includes("\n");
    const baseFont = isMulti ? 30 : 36;
    return Math.round(baseFont * 1.18);
  });
  const [rotate, setRotate] = useState(characters[character].defaultText.r);
  const [curve, setCurve] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [textColor, setTextColor] = useState(characters[character].color);

  // 选项卡状态：支持 hash 响应
  const [activeTab, setActiveTabState] = useState(() => {
    if (typeof window !== "undefined") {
      const h = window.location.hash.replace("#", "");
      if (["text", "stickers", "style"].includes(h)) return h;
    }
    return "text";
  });

  const switchTab = (tab) => {
    setActiveTabState(tab);
    if (typeof window !== "undefined") {
      window.location.hash = tab;
    }
  };

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.replace("#", "");
      if (["text", "stickers", "style"].includes(h)) {
        setActiveTabState(h);
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // 贴纸筛选状态（内置贴纸库浏览器）
  const [selectedUnit, setSelectedUnit] = useState("all");
  const [stickerSearch, setStickerSearch] = useState("");
  const [stickerDisplayLimit, setStickerDisplayLimit] = useState(64);

  const units = [
    { id: "all", name: t("unit_all") },
    { id: "バーチャル・シンガー", name: "バーチャル・シンガー" },
    { id: "Leo/need", name: "Leo/need" },
    { id: "MORE MORE JUMP！", name: "MORE MORE JUMP！" },
    { id: "Vivid BAD SQUAD", name: "Vivid BAD SQUAD" },
    { id: "ワンダーランズ×ショウタイム", name: "ワンダーランズ×ショウタイム" },
    { id: "25時、ナイトコードで。", name: "25時、ナイトコードで。" },
  ];

  const filteredStickerList = useMemo(() => {
    const q = stickerSearch.trim().toLowerCase();
    return STICKERS_WITH_META.filter((item) => {
      if (selectedUnit !== "all" && item.unit !== selectedUnit) return false;
      if (q) {
        const matchName = item.name.toLowerCase().includes(q);
        const matchChar = item.character?.toLowerCase().includes(q);
        const matchJa = item.nameJa?.toLowerCase().includes(q);
        const matchZh = item.nameZh?.toLowerCase().includes(q);
        const matchEn = item.nameEn?.toLowerCase().includes(q);
        const matchText = item.defaultText?.text?.toLowerCase().includes(q);
        return matchName || matchChar || matchJa || matchZh || matchEn || matchText;
      }
      return true;
    });
  }, [selectedUnit, stickerSearch]);

  const visibleStickerList = useMemo(() => {
    return filteredStickerList.slice(0, stickerDisplayLimit);
  }, [filteredStickerList, stickerDisplayLimit]);

  const img = new Image();

  // 字体加载监听
  useEffect(() => {
    let isCancelled = false;
    setFontLoadedVersion((v) => v + 1);

    if (document.fonts) {
      const primaryFontMatch = currentFontFamily.match(/['"]?([^,'"]+)['"]?/);
      const primaryFont = primaryFontMatch ? primaryFontMatch[1].trim() : "";

      if (primaryFont && document.fonts.load) {
        document.fonts
          .load(`${fontSize}px "${primaryFont}"`, text || "Wonderhoy")
          .then(() => {
            if (!isCancelled) setFontLoadedVersion((v) => v + 1);
          })
          .catch(() => {});
      }

      const handleLoadingDone = () => {
        if (!isCancelled) setFontLoadedVersion((v) => v + 1);
      };

      if (document.fonts.addEventListener) {
        document.fonts.addEventListener("loadingdone", handleLoadingDone);
      }
      if (document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (!isCancelled) setFontLoadedVersion((v) => v + 1);
        });
      }

      return () => {
        isCancelled = true;
        if (document.fonts.removeEventListener) {
          document.fonts.removeEventListener("loadingdone", handleLoadingDone);
        }
      };
    }
  }, [text, stickerFont, fontSize, currentFontFamily]);

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setLoaded(false);
  }, [character]);

  img.src = import.meta.env.BASE_URL + "img/" + characters[character].img;
  img.onload = () => setLoaded(true);

  let angle = (Math.PI * text.length) / 7;

  const draw = (ctx) => {
    ctx.canvas.width = 296;
    ctx.canvas.height = 256;

    if (loaded) {
      var hRatio = ctx.canvas.width / img.width;
      var vRatio = ctx.canvas.height / img.height;
      var ratio = Math.min(hRatio, vRatio);
      var centerShift_x = (ctx.canvas.width - img.width * ratio) / 2;
      var centerShift_y = (ctx.canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y,
        img.width * ratio, img.height * ratio
      );
      ctx.font = `${fontSize}px sans-serif`;
      try {
        ctx.font = `${fontSize}px ${currentFontFamily}`;
      } catch (e) {
        ctx.font = `${fontSize}px sans-serif`;
      }
      ctx.lineWidth = 9;
      ctx.save();

      ctx.translate(position.x, position.y);
      ctx.rotate(rotate / 10);
      ctx.textAlign = "center";
      ctx.strokeStyle = "white";
      ctx.fillStyle = textColor || characters[character].color;
      var lines = text.split("\n");
      if (curve) {
        for (let line of lines) {
          for (let i = 0; i < line.length; i++) {
            ctx.rotate(angle / line.length / 2.5);
            ctx.save();
            ctx.translate(0, -1 * fontSize * 3.5);
            ctx.strokeText(line[i], 0, 0);
            ctx.fillText(line[i], 0, 0);
            ctx.restore();
          }
        }
        ctx.restore();
      } else {
        for (var i = 0, k = 0; i < lines.length; i++) {
          ctx.strokeText(lines[i], 0, k);
          ctx.fillText(lines[i], 0, k);
          k += spaceSize;
        }
        ctx.restore();
      }
    }
  };

  const download = () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${characters[character].name}_pjsk-sticker.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  function b64toBlob(b64Data, contentType = null, sliceSize = null) {
    contentType = contentType || "image/png";
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  const copy = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    if (!canvas) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": b64toBlob(canvas.toDataURL().split(",")[1]),
        }),
      ]);
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2400);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const activeCharName = useMemo(() => {
    if (!activeSticker) return "";
    if (i18n.language.startsWith("zh")) return activeSticker.nameZh || activeSticker.name;
    if (i18n.language.startsWith("ja")) return activeSticker.nameJa || activeSticker.name;
    return activeSticker.nameEn || activeSticker.character;
  }, [activeSticker, i18n.language]);

  return (
    <div className="App">
      {/* MD3 Top App Bar */}
      <header className="md3-top-app-bar">
        <div className="top-bar-inner">
          <div className="brand-cluster">
            <SekaiDiamond />
            <span className="brand-title">Sekai Stickers</span>
            <span className="brand-chip">MD3</span>
          </div>

          <div className="top-bar-actions">
            {/* 动态角色主题色开关 */}
            <button
              type="button"
              className={`theme-toggle-btn ${dynamicTheme ? "active" : ""}`}
              onClick={toggleDynamicTheme}
              title={dynamicTheme ? "正在跟随角色代表色（点击切换回青色主题）" : "正在使用 Matugen 青色主题（点击开启角色动态染色）"}
            >
              <span className="theme-dot" style={{ backgroundColor: dynamicTheme ? (activeSticker?.charColor || "#59dbc1") : "#59dbc1" }} />
              <span className="theme-label">{t("dynamic_theme")}</span>
            </button>

            {/* 语言切换胶囊 */}
            <div className="lang-pill-group">
              <button
                type="button"
                className={i18n.language === "zh" ? "active" : ""}
                onClick={() => changeLanguage("zh")}
              >
                简中
              </button>
              <button
                type="button"
                className={i18n.language === "en" ? "active" : ""}
                onClick={() => changeLanguage("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={i18n.language === "ja" ? "active" : ""}
                onClick={() => changeLanguage("ja")}
              >
                日本語
              </button>
            </div>

            {/* 信息关于弹窗 */}
            <button
              type="button"
              className="info-icon-btn"
              onClick={() => setInfoOpen(true)}
              title={t("info_title")}
            >
              <IconInfo />
            </button>
          </div>
        </div>
      </header>

      <Info open={infoOpen} handleClose={() => setInfoOpen(false)} />
      <ColorPickerModal
        open={colorModalOpen}
        onClose={() => setColorModalOpen(false)}
        currentColor={textColor}
        onSelectColor={setTextColor}
        defaultCharacterColor={characters[character].color}
      />

      {/* 复制成功浮动提示 (MD3 Tonal Toast) */}
      {copiedStatus && (
        <div className="md3-toast-banner">
          <IconCheck />
          <span>{t("copied_to_clipboard")}</span>
        </div>
      )}

      {/* 主布局：横屏双栏响应式 / 竖屏紧凑流式 */}
      <main className="app-main-layout">
        {/* 左侧 (横屏模式为粘性舞台，竖屏模式为顶部焦点舞台) */}
        <section className="stage-column">
          <div className="md3-card stage-card">
            <div className="canvas-container-box">
              <div className="canvas-viewport">
                <Canvas
                  draw={draw}
                  redrawTrigger={fontLoadedVersion}
                  aria-label="Project Sekai Sticker Canvas"
                  role="img"
                />
              </div>

              {/* Y轴垂直拉杆 (带 ±1px 精确微调) */}
              <div className="canvas-axis-y">
                <button
                  type="button"
                  className="axis-nudge-btn"
                  onClick={() => setPosition((p) => ({ ...p, y: Math.max(0, p.y - 1) }))}
                  title="上移 1px"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                </button>
                <div className="axis-slider-track-y">
                  <input
                    type="range"
                    min="0"
                    max="256"
                    step="1"
                    value={curve ? 256 - position.y + fontSize * 3 : 256 - position.y}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setPosition((p) => ({
                        ...p,
                        y: curve ? 256 + fontSize * 3 - v : 256 - v,
                      }));
                    }}
                    className="md3-range-vertical"
                  />
                </div>
                <button
                  type="button"
                  className="axis-nudge-btn"
                  onClick={() => setPosition((p) => ({ ...p, y: Math.min(256, p.y + 1) }))}
                  title="下移 1px"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              </div>
            </div>

            {/* X轴水平拉杆 (带 ±1px 精确微调) */}
            <div className="canvas-axis-x-wrap">
              <button
                type="button"
                className="axis-nudge-btn"
                onClick={() => setPosition((p) => ({ ...p, x: Math.max(0, p.x - 1) }))}
                title="左移 1px"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div className="axis-slider-track-x">
                <input
                  type="range"
                  min="0"
                  max="296"
                  step="1"
                  value={position.x}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPosition((p) => ({ ...p, x: v }));
                  }}
                  className="md3-range-horizontal"
                />
              </div>
              <button
                type="button"
                className="axis-nudge-btn"
                onClick={() => setPosition((p) => ({ ...p, x: Math.min(296, p.x + 1) }))}
                title="右移 1px"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            {/* 当前选中贴纸元数据胶囊 */}
            <div className="sticker-meta-strip">
              <img
                src={import.meta.env.BASE_URL + activeSticker.charAvatar}
                alt={activeCharName}
                className="meta-avatar-img"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="meta-text-col">
                <div className="meta-title-row">
                  <span className="meta-char-name">{activeCharName}</span>
                  <span className="meta-unit-badge" style={{ borderColor: activeSticker.charColor }}>
                    {activeSticker.unit}
                  </span>
                  <span className={`meta-source-tag ${activeSticker.source === "manual" ? "manual" : "ai"}`}>
                    {activeSticker.source === "manual" ? t("source_manual") : t("source_ai")}
                  </span>
                </div>
                <div className="meta-sub-row">
                  <span className="meta-orig-text">“{activeSticker.defaultText?.text}”</span>
                </div>
              </div>
            </div>

            {/* 核心操作按钮组 (MD3 Filled & Tonal 规范) */}
            <div className="stage-action-bar">
              <button
                type="button"
                className="md3-btn-filled action-btn-main"
                onClick={copy}
              >
                {copiedStatus ? <IconCheck /> : <IconCopy />}
                <span>{copiedStatus ? t("copied_to_clipboard") : t("copy")}</span>
              </button>

              <button
                type="button"
                className="md3-btn-tonal action-btn-main"
                onClick={download}
              >
                <IconDownload />
                <span>{t("download")}</span>
              </button>

              <button
                type="button"
                className="md3-btn-outlined action-btn-icon"
                onClick={handleResetText}
                title={t("reset_text")}
              >
                <IconReset />
              </button>
            </div>
          </div>
        </section>

        {/* 右侧 (横屏为控件主控区，竖屏为紧随其后的折叠面板区) */}
        <section className="controls-column">
          {/* MD3 选项卡控制器 */}
          <div className="md3-segmented-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === "text" ? "active" : ""}`}
              onClick={() => switchTab("text")}
            >
              <span>✍ {t("tab_text")}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "stickers" ? "active" : ""}`}
              onClick={() => switchTab("stickers")}
            >
              <span>🎭 {t("tab_characters")}</span>
              <span className="tab-count-badge">{characters.length}</span>
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === "style" ? "active" : ""}`}
              onClick={() => switchTab("style")}
            >
              <span>⚙ {t("tab_style")}</span>
            </button>
          </div>

          {/* TAB 1: 文案与灵感 */}
          {activeTab === "text" && (
            <div className="md3-card tab-panel-card">
              <div className="panel-header-row">
                <span className="panel-title">{t("text_label")}</span>
                <div className="quote-action-group">
                  <button
                    type="button"
                    className={`btn-step ${historyIndex > 0 ? "" : "disabled"}`}
                    onClick={handlePrevQuote}
                    disabled={historyIndex <= 0}
                    title="上一条历史文案"
                  >
                    <IconPrev />
                  </button>
                  <button
                    type="button"
                    className={`btn-step ${historyIndex < history.length - 1 ? "" : "disabled"}`}
                    onClick={handleNextQuote}
                    disabled={historyIndex >= history.length - 1}
                    title="下一条历史文案"
                  >
                    <IconNext />
                  </button>
                  <button
                    type="button"
                    className="md3-btn-tonal btn-random-quote"
                    onClick={handleRandomQuote}
                    title="随机摇一条抽象中文短句"
                  >
                    <IconDice />
                    <span>{t("random_quote")}</span>
                  </button>
                </div>
              </div>

              <div className="md3-textfield-box">
                <textarea
                  rows="3"
                  className="md3-textarea"
                  value={text}
                  placeholder="输入表情包自定义文字 (回车即可折行)..."
                  onChange={(e) => handleTextChange(e.target.value)}
                />
              </div>

              {/* 快捷推荐台词 / 贴纸原案一键回填 */}
              <div className="quick-chips-row">
                <span className="quick-chips-label">快捷填入:</span>
                <button
                  type="button"
                  className="quick-text-chip"
                  onClick={() => handleTextChange(activeSticker.defaultText?.text || "")}
                >
                  原案: {activeSticker.defaultText?.text}
                </button>
                <button
                  type="button"
                  className="quick-text-chip"
                  onClick={() => handleTextChange("わんだほーい！")}
                >
                  わんだほーい！
                </button>
                <button
                  type="button"
                  className="quick-text-chip"
                  onClick={() => handleTextChange("大天才！！")}
                >
                  大天才！！
                </button>
                <button
                  type="button"
                  className="quick-text-chip"
                  onClick={() => handleTextChange("お疲れ様！")}
                >
                  お疲れ様！
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: 角色与贴纸库 (集成式 758 张全贴纸库) */}
          {activeTab === "stickers" && (
            <div className="md3-card tab-panel-card">
              {/* 组合过滤标签 */}
              <div className="unit-chips-scroll">
                {units.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className={`unit-chip ${selectedUnit === u.id ? "active" : ""}`}
                    onClick={() => {
                      setSelectedUnit(u.id);
                      setStickerDisplayLimit(64);
                    }}
                  >
                    {u.name}
                  </button>
                ))}
              </div>

              {/* 搜索过滤栏 */}
              <div className="sticker-search-bar">
                <IconSearch />
                <input
                  type="text"
                  className="sticker-search-input"
                  placeholder={t("search_placeholder")}
                  value={stickerSearch}
                  onChange={(e) => {
                    setStickerSearch(e.target.value);
                    setStickerDisplayLimit(64);
                  }}
                />
                {stickerSearch && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setStickerSearch("")}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* 贴纸卡片网格 */}
              <div className="sticker-grid-container">
                {visibleStickerList.map((stk) => {
                  const isCurrent = character === stk.originalIndex;
                  return (
                    <button
                      key={stk.id}
                      type="button"
                      className={`sticker-grid-item ${isCurrent ? "current-selected" : ""}`}
                      onClick={() => handleSelectSticker(stk.originalIndex)}
                      title={`${stk.name} - ${stk.defaultText?.text}`}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}img/${stk.img}`}
                        alt={stk.name}
                        loading="lazy"
                        className="grid-thumb-img"
                      />
                      <span className="grid-thumb-label">
                        {stk.defaultText?.text?.split("\n")[0] || stk.name}
                      </span>
                      {stk.source === "manual" && (
                        <span className="grid-thumb-badge">手工</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {visibleStickerList.length < filteredStickerList.length && (
                <div className="load-more-row">
                  <button
                    type="button"
                    className="md3-btn-tonal load-more-btn"
                    onClick={() => setStickerDisplayLimit((p) => p + 64)}
                  >
                    {t("load_more")} ({t("remaining")} {filteredStickerList.length - visibleStickerList.length} {t("count_unit")})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 排版与参数 (字体 / 颜色 / 旋转 / 字号 / 间距 / 弯曲) */}
          {activeTab === "style" && (
            <div className="md3-card tab-panel-card">
              {/* 字体选择网格 */}
              <div className="setting-block">
                <span className="setting-block-title">{t("sticker_font")}</span>
                <div className="font-chips-grid">
                  {STICKER_FONTS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`font-chip ${stickerFont === f.id ? "active" : ""}`}
                      onClick={() => handleFontChange(f.id)}
                    >
                      <span>{t(f.label)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 文字颜色 */}
              <div className="setting-block">
                <div className="setting-row-flex">
                  <span className="setting-block-title">{t("text_color")}</span>
                  <button
                    type="button"
                    className="btn-palette-trigger"
                    onClick={() => setColorModalOpen(true)}
                  >
                    <IconPalette />
                    <span>{t("color_palette")}</span>
                  </button>
                </div>
                <div className="color-swatches-row">
                  {PRESET_QUICK_COLORS.map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      className={`color-swatch-btn ${textColor?.toLowerCase() === c.color.toLowerCase() ? "active" : ""}`}
                      style={{ backgroundColor: c.color }}
                      onClick={() => setTextColor(c.color)}
                      title={c.label}
                    />
                  ))}
                  <button
                    type="button"
                    className="color-swatch-btn current-char-swatch"
                    style={{ backgroundColor: activeSticker.charColor }}
                    onClick={() => setTextColor(activeSticker.charColor)}
                    title={`当前角色专属色 (${activeSticker.charColor})`}
                  />
                  <div className="color-hex-tag">
                    <span>{textColor?.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* 旋转角度 */}
              <div className="slider-setting-box">
                <div className="slider-label-row">
                  <span className="slider-title">{t("rotate")}</span>
                  <EditableNumberTag
                    value={Math.round(rotate * 5.7296)}
                    unit="°"
                    min={-60}
                    max={60}
                    step={1}
                    onChange={(deg) => setRotate(deg / 5.7296)}
                  />
                </div>
                <div className="slider-input-row">
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="0.2"
                    value={rotate}
                    onChange={(e) => setRotate(Number(e.target.value))}
                    className="md3-range-horizontal"
                  />
                </div>
              </div>

              {/* 字号大小 */}
              <div className="slider-setting-box">
                <div className="slider-label-row">
                  <span className="slider-title">{t("font_size")}</span>
                  <EditableNumberTag
                    value={fontSize}
                    unit="px"
                    min={10}
                    max={100}
                    step={1}
                    onChange={(v) => setFontSize(v)}
                  />
                </div>
                <div className="slider-input-row">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="md3-range-horizontal"
                  />
                </div>
              </div>

              {/* 行间距 */}
              <div className="slider-setting-box">
                <div className="slider-label-row">
                  <span className="slider-title">{t("spacing")}</span>
                  <EditableNumberTag
                    value={spaceSize}
                    unit="px"
                    min={18}
                    max={100}
                    step={1}
                    onChange={(v) => setSpaceSize(v)}
                  />
                </div>
                <div className="slider-input-row">
                  <input
                    type="range"
                    min="18"
                    max="100"
                    step="1"
                    value={spaceSize}
                    onChange={(e) => setSpaceSize(Number(e.target.value))}
                    className="md3-range-horizontal"
                  />
                </div>
              </div>

              {/* 文字弯曲开关 */}
              <div className="switch-setting-row">
                <span className="switch-label">{t("curve")}</span>
                <label className="md3-switch-label">
                  <input
                    type="checkbox"
                    checked={curve}
                    onChange={(e) => setCurve(e.target.checked)}
                    className="md3-switch-input"
                  />
                  <span className="md3-switch-slider" />
                </label>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* SEO 贴纸文本列表 */}
      <ul className="visually-hidden" aria-hidden="false">
        {characters.map((c, index) => (
          <li key={index}>
            <img
              src={`${import.meta.env.BASE_URL}img/${c.img}`}
              alt={`${c.name} - ${c.defaultText?.text}`}
            />
            <span>
              {c.name} - {c.defaultText?.text}
            </span>
          </li>
        ))}
      </ul>

      {/* 预热 WebFonts 切片 */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: -9999,
          top: -9999,
          opacity: 0.01,
          pointerEvents: 'none',
          width: 1,
          height: 1,
          overflow: 'hidden',
          zIndex: -1,
        }}
      >
        {STICKER_FONTS.map((f) => (
          <span key={f.id} style={{ fontFamily: f.fontFamily }}>
            {text || "测试ABC"}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
