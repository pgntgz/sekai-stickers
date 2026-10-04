import "./App.css";
import Canvas from "./components/Canvas";
import { useState, useEffect, useRef } from "react";
import characters from "./characters.json";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Picker from "./components/Picker";
import Info from "./components/Info";
import ColorPickerModal from "./components/ColorPickerModal";
import { useTranslation } from "react-i18next";
import { getRandomQuote, prefetchQuotes, smartBreakText } from "./utils/quotes";

// 精致单色 SVG 矢量图标（完全去除彩色 Emoji，确保所有操作系统渲染一致）
const IconDice = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="8" cy="8" r="1.2" fill="currentColor" />
    <circle cx="16" cy="8" r="1.2" fill="currentColor" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    <circle cx="8" cy="16" r="1.2" fill="currentColor" />
    <circle cx="16" cy="16" r="1.2" fill="currentColor" />
  </svg>
);

const IconPrev = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconNext = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconReset = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const IconCopy = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconPalette = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: 2 }}>
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const IconDownload = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconCharacter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="7" r="4" />
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
  </svg>
);

const SekaiDiamond = () => (
  <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ color: "var(--pjsk-color-primary)", marginRight: 6 }}>
    <polygon points="8,0 16,8 8,16 0,8" />
  </svg>
);

const { ClipboardItem } = window;

// 全平台通用系统中文回退栈，保证任何字体缺少特定字符（如简体汉字、生僻字）时，绝不空白丢失，平滑降级
const SYSTEM_FALLBACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", "Noto Sans SC", sans-serif';

// 贴纸可选字体栈：默认优先采用字库完备且可爱的中文二次元字体，日服原版作为可选
const STICKER_FONTS = [
  // 1. 站酷快乐体（国服贴纸同款活泼可爱风，简体常用汉字全收录，绝不缺字）
  { id: "kuaile", label: "font_kuaile", fontFamily: `'ZCOOL KuaiLe', ${SYSTEM_FALLBACK}` },
  // 2. 文泉驿标准体（中庸大方，字库完整覆盖简繁中日，绝无缺字）
  { id: "wqy", label: "font_wqy", fontFamily: `'WenQuanYi Zen Hei', 'WenQuanYi Micro Hei', 'Noto Sans SC', ${SYSTEM_FALLBACK}` },
  // 3. 原版经典二次元字体（日服原版贴纸字体，缺部分简中字时平滑回退系统中文）
  { id: "yuruka", label: "font_yuruka", fontFamily: `'YurukaStd', ${SYSTEM_FALLBACK}` },
  // 4. Dela 爆裂海报（日本高张力黑体，适合喊叫吐槽风格）
  { id: "dela", label: "font_dela", fontFamily: `'Dela Gothic One', ${SYSTEM_FALLBACK}` },
  // 5. Mochiy 圆滚体（肥润二次元萌感）
  { id: "mochiy", label: "font_mochiy", fontFamily: `'Mochiy Pop One', ${SYSTEM_FALLBACK}` },
  // 6. 8Bit 像素体（DotGothic16，复古游戏风格）
  { id: "pixel", label: "font_pixel", fontFamily: `'DotGothic16', ${SYSTEM_FALLBACK}` },
  // 7. 站酷黄油体（圆润厚实中文）
  { id: "huangyou", label: "font_huangyou", fontFamily: `'ZCOOL QingKe HuangYou', ${SYSTEM_FALLBACK}` },
  // 8. 马善政毛笔狂草体（国风水墨书法）
  { id: "brush", label: "font_brush", fontFamily: `'Ma Shan Zheng', ${SYSTEM_FALLBACK}` },
  // 9. 系统原生黑体（本地零延迟，最稳兼容）
  { id: "system", label: "font_system", fontFamily: SYSTEM_FALLBACK },
  // 10. 尚手方糖体（可爱方块风格）
  { id: "tangtang", label: "font_tangtang", fontFamily: `'SSFangTangTi', 'ShangShouFangTangTi', ${SYSTEM_FALLBACK}` },
];

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("pjsk_lang", lng);
  };

  // 贴纸字体状态
  const [stickerFont, setStickerFont] = useState(
    localStorage.getItem("pjsk_font") || "kuaile"
  );
  const handleFontChange = (fontId) => {
    setStickerFont(fontId);
    localStorage.setItem("pjsk_font", fontId);
    // 切换字体时立即自增版本号，迫使 Canvas 第一时间执行重绘
    setFontLoadedVersion((v) => v + 1);
  };
  const currentFontFamily =
    STICKER_FONTS.find((f) => f.id === stickerFont)?.fontFamily ||
    STICKER_FONTS[0].fontFamily;

  // 强制重绘计数器，作为 Canvas 的响应式刷新触发器
  const [fontLoadedVersion, setFontLoadedVersion] = useState(0);

  const [infoOpen, setInfoOpen] = useState(false);
  const handleClickOpen = () => setInfoOpen(true);
  const handleClose = () => setInfoOpen(false);

  const [character, setCharacter] = useState(49);

  // 文案历史队列与防误触撤销系统（支持前进/后退/历史找回）
  const [history, setHistory] = useState(() => {
    const init = smartBreakText(getRandomQuote() || characters[49].defaultText.text);
    return [init];
  });
  const [historyIndex, setHistoryIndex] = useState(0);
  const text = history[historyIndex] !== undefined ? history[historyIndex] : "";

  // 挂载时后台静默预取更多段子
  useEffect(() => {
    prefetchQuotes();
  }, []);

  // 手动输入文字：就地更新当前词条，防止打字按键刷爆历史队列
  const handleTextChange = (newVal) => {
    setHistory((prev) => {
      const next = [...prev];
      next[historyIndex] = newVal;
      return next;
    });
    // 若用户手动输入了换行且当前行距过小，自动选用舒适透气的行距
    if (newVal.includes("\n") && spaceSize < 24) {
      setSpaceSize(Math.round(fontSize * 1.15));
    }
  };

  // 摇一发抽象段子（智能断行 + 自动行距防粘连 + 压入历史）
  const handleRandomQuote = () => {
    const raw = getRandomQuote();
    if (raw) {
      const formatted = smartBreakText(raw);
      setHistory((prev) => {
        const next = [...prev.slice(0, historyIndex + 1), formatted];
        return next.slice(-30);
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 29));

      // 贴纸文字防溢出排版：默认字号微调更克制，依据字数与行数精准自适应
      if (formatted.includes("\n")) {
        const longest = Math.max(...formatted.split("\n").map((l) => l.length));
        const targetFont = longest >= 8 ? 28 : 32;
        setFontSize(targetFont);
        setSpaceSize(Math.round(targetFont * 1.18)); // 舒适行间距，杜绝两行粘连
      } else {
        const targetFont = formatted.length >= 8 ? 32 : 36;
        setFontSize(targetFont);
        setSpaceSize(Math.round(targetFont * 1.18));
      }
    }
  };

  // 回到上一条文案（防多按误触）
  const handlePrevQuote = () => {
    if (historyIndex > 0) {
      setHistoryIndex((idx) => idx - 1);
    }
  };

  // 前进到下一条文案
  const handleNextQuote = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((idx) => idx + 1);
    }
  };

  // 恢复角色官方初始文字与推荐参数（文字颜色同步恢复角色代表色）
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
  const [position, setPosition] = useState({
    x: characters[character].defaultText.x,
    y: characters[character].defaultText.y,
  });
  // 默认字号适度缩小，确保10字以内排版均不出界
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
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const img = new Image();

  // 核心修复：精准监听字体加载与字体切片拉取，彻底杜绝切字体时继承上一个字体未加载状态的 Bug
  useEffect(() => {
    let isCancelled = false;

    // 切换字体/文本变化时立即先更新一次
    setFontLoadedVersion((v) => v + 1);

    if (document.fonts) {
      // 提取主字体名进行单独加载验证
      const primaryFontMatch = currentFontFamily.match(/['"]?([^,'"]+)['"]?/);
      const primaryFont = primaryFontMatch ? primaryFontMatch[1].trim() : "";

      if (primaryFont && document.fonts.load) {
        document.fonts
          .load(`${fontSize}px "${primaryFont}"`, text || "Wonderhoy")
          .then(() => {
            if (!isCancelled) {
              setFontLoadedVersion((v) => v + 1);
            }
          })
          .catch(() => {});
      }

      // 监听异步字体/切片下载完成
      const handleLoadingDone = () => {
        if (!isCancelled) {
          setFontLoadedVersion((v) => v + 1);
        }
      };

      if (document.fonts.addEventListener) {
        document.fonts.addEventListener("loadingdone", handleLoadingDone);
      }

      if (document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (!isCancelled) {
            setFontLoadedVersion((v) => v + 1);
          }
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

  // 核心体验优化：切换贴纸角色时，完整保留用户精心调整的自定义文案、字号、旋转与间距！
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    // 切换贴纸时仅重新加载图片，保留现有文本和一切排版参数！
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
      // 防御性重置 font 状态，防止 Canvas 引擎静默继承上一个字体的值
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
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": b64toBlob(canvas.toDataURL().split(",")[1]),
      }),
    ]);
  };

  return (
    <div className="App">
      {/* 极简精致顶栏 */}
      <header className="app-header">
        <div className="brand-badge">
          <span className="brand-title">Sekai Stickers</span>
          <SekaiDiamond /><span className="brand-tag">SEKAI</span>
        </div>

        {/* 语言切换胶囊 */}
        <div className="language-selector">
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
      </header>

      <Info open={infoOpen} handleClose={handleClose} />
      <ColorPickerModal
        open={colorModalOpen}
        onClose={() => setColorModalOpen(false)}
        currentColor={textColor}
        onSelectColor={setTextColor}
        defaultCharacterColor={characters[character].color}
      />

      <main className="container">
        {/* 贴纸舞台画布卡片 (MD3 Surface) */}
        <div className="pjsk-card canvas-card">
          <div className="canvas-wrapper">
            <div className="canvas-viewport">
              <Canvas
                draw={draw}
                redrawTrigger={fontLoadedVersion}
                aria-label="Project Sekai Sticker Canvas"
                role="img"
              />
            </div>
            {/* Y轴位置微调滑块 (长轨平滑拖拽 + 1px像素级微调) */}
            <div className="canvas-axis-y">
              <button
                type="button"
                className="axis-nudge-btn"
                onClick={() => setPosition((p) => ({ ...p, y: Math.max(0, p.y - 1) }))}
                title="上移 1px"
                aria-label="Nudge up"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
              <Slider
                value={
                  curve ? 256 - position.y + fontSize * 3 : 256 - position.y
                }
                onChange={(e, v) =>
                  setPosition({
                    ...position,
                    y: curve ? 256 + fontSize * 3 - v : 256 - v,
                  })
                }
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `Y: ${curve ? 256 + fontSize * 3 - v : 256 - v}`}
                min={0}
                max={256}
                step={1}
                orientation="vertical"
                track={false}
              />
              <button
                type="button"
                className="axis-nudge-btn"
                onClick={() => setPosition((p) => ({ ...p, y: Math.min(256, p.y + 1) }))}
                title="下移 1px"
                aria-label="Nudge down"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>
          </div>
          {/* X轴位置微调滑块 (带左右 1px 微调) */}
          <div className="canvas-axis-x-wrap">
            <button
              type="button"
              className="axis-nudge-btn"
              onClick={() => setPosition((p) => ({ ...p, x: Math.max(0, p.x - 1) }))}
              title="左移 1px"
              aria-label="Nudge left"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="canvas-axis-x">
              <Slider
                value={position.x}
                onChange={(e, v) => setPosition({ ...position, x: v })}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `X: ${v}`}
                min={0}
                max={296}
                step={1}
                track={false}
              />
            </div>
            <button
              type="button"
              className="axis-nudge-btn"
              onClick={() => setPosition((p) => ({ ...p, x: Math.min(296, p.x + 1) }))}
              title="右移 1px"
              aria-label="Nudge right"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        {/* 文字与抽象段子灵感卡片 (带撤销/前进历史记录) */}
        <div className="pjsk-card">
          <div className="text-input-wrap">
            <div className="text-action-bar">
              <span className="section-title">{t("text_label")}</span>
              <div className="quote-btn-group">
                {/* 历史回退按钮（防多按误触） */}
                <button
                  type="button"
                  className={`btn-history-step ${historyIndex > 0 ? "" : "disabled"}`}
                  onClick={handlePrevQuote}
                  disabled={historyIndex <= 0}
                  title="回到上一条文案（防多抽误触）"
                  aria-label="Previous quote"
                >
                  <IconPrev />
                </button>
                {/* 历史前进按钮 */}
                <button
                  type="button"
                  className={`btn-history-step ${historyIndex < history.length - 1 ? "" : "disabled"}`}
                  onClick={handleNextQuote}
                  disabled={historyIndex >= history.length - 1}
                  title="前进到下一条文案"
                  aria-label="Next quote"
                >
                  <IconNext />
                </button>
                {/* 随机段子按钮 */}
                <button
                  type="button"
                  className="btn-random-quote"
                  onClick={handleRandomQuote}
                  title="随机摇一条抽象中文短段子（自动分词折行）"
                >
                  <IconDice />
                  <span>{t("random_quote")}</span>
                </button>
                {/* 恢复官方默认台词 */}
                <button
                  type="button"
                  className="btn-reset-text"
                  onClick={handleResetText}
                  title="恢复角色官方默认台词"
                  aria-label="Reset to default text"
                >
                  <IconReset />
                </button>
              </div>
            </div>
            <TextField
              size="small"
              value={text}
              multiline={true}
              fullWidth
              placeholder="输入表情包文字..."
              onChange={(e) => handleTextChange(e.target.value)}
            />
          </div>
        </div>

        {/* 控制中心卡片 (字体 / 旋转 / 字号 / 间距 / 弧形) */}
        <div className="pjsk-card">
          <div className="section-header">
            <span className="section-title">{t("settings_title")}</span>
          </div>

          {/* 贴纸字体下拉 */}
          <FormControl fullWidth size="small" style={{ marginBottom: 14 }}>
            <InputLabel id="font-select-label">{t("sticker_font")}</InputLabel>
            <Select
              labelId="font-select-label"
              value={stickerFont}
              label={t("sticker_font")}
              onChange={(e) => handleFontChange(e.target.value)}
            >
              {STICKER_FONTS.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {t(f.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="settings-grid">
            <div className="setting-row">
              <span className="setting-label">{t("text_color")}</span>
              <button
                type="button"
                className="btn-color-palette-trigger"
                onClick={() => setColorModalOpen(true)}
                title={t("color_palette")}
              >
                <span
                  className="color-swatch-circle"
                  style={{ backgroundColor: textColor }}
                />
                <span className="color-hex-label">{textColor?.toUpperCase()}</span>
                <IconPalette />
              </button>
            </div>

            <div className="setting-row">
              <span className="setting-label">{t("rotate")}</span>
              <div className="setting-slider-wrap">
                <Slider
                  value={rotate}
                  onChange={(e, v) => setRotate(v)}
                  min={-10}
                  max={10}
                  step={0.2}
                  track={false}
                />
                <span className="setting-val-tag">{(rotate * 5.7).toFixed(0)}°</span>
              </div>
            </div>

            <div className="setting-row">
              <span className="setting-label">{t("font_size")}</span>
              <div className="setting-slider-wrap">
                <Slider
                  value={fontSize}
                  onChange={(e, v) => setFontSize(v)}
                  min={10}
                  max={100}
                  step={1}
                  track={false}
                />
                <span className="setting-val-tag">{fontSize}px</span>
              </div>
            </div>

            <div className="setting-row">
              <span className="setting-label">{t("spacing")}</span>
              <div className="setting-slider-wrap">
                <Slider
                  value={spaceSize}
                  onChange={(e, v) => setSpaceSize(v)}
                  min={18}
                  max={100}
                  step={1}
                  track={false}
                />
                <span className="setting-val-tag">{spaceSize}px</span>
              </div>
            </div>

            <div className="setting-row" style={{ paddingTop: 4 }}>
              <span className="setting-label">{t("curve")}</span>
              <Switch
                size="small"
                checked={curve}
                onChange={(e) => setCurve(e.target.checked)}
              />
            </div>
          </div>
        </div>

        {/* 角色选择器 */}
        <div className="character-picker-bar">
          <Picker setCharacter={setCharacter} />
        </div>

        {/* 底部行动主操作栏 */}
        <div className="action-buttons">
          <button type="button" className="btn-action btn-copy" onClick={copy}>
            <IconCopy /><span>{t("copy")}</span>
          </button>
          <button type="button" className="btn-action btn-download" onClick={download}>
            <IconDownload /><span>{t("download")}</span>
          </button>
        </div>

        {/* 页脚说明 */}
        <footer className="app-footer">
          <button type="button" className="btn-info-link" onClick={handleClickOpen}>
            <span>{t("info")}</span>
          </button>
        </footer>
      </main>

{/* SEO 贴纸文本与图片列表（视觉上隐藏） */}
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

      {/* 预热 WebFonts 切片：实时放入用户输入的实际字符 {text}，促使浏览器立即拉取所需汉字切片 */}
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
