import "./App.css";
import Canvas from "./components/Canvas";
import { useState, useEffect } from "react";
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
import { useTranslation } from "react-i18next";

const { ClipboardItem } = window;

// 全平台通用系统中文回退栈，保证任何字体缺少特定字符（如简体汉字、生僻字）时，绝不空白丢失，平滑降级
const SYSTEM_FALLBACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", "Noto Sans SC", sans-serif';

const STICKER_FONTS = [
  // 1. 原版经典二次元字体（日文专属字形，缺简体中文时优雅回退系统黑体，绝不消失）
  { id: "yuruka", label: "font_yuruka", fontFamily: `'YurukaStd', ${SYSTEM_FALLBACK}` },
  // 2. 文泉驿标准中文字体（中庸大方，字库完整覆盖简繁中日，绝不花哨）
  { id: "wqy", label: "font_wqy", fontFamily: `'WenQuanYi Zen Hei', 'WenQuanYi Micro Hei', 'Noto Sans SC', ${SYSTEM_FALLBACK}` },
  // 3. 系统原生黑体（本地加载零延迟，兼容性最强）
  { id: "system", label: "font_system", fontFamily: SYSTEM_FALLBACK },
  // 4. Dela 爆裂海报（高张力粗体，适合大声吐槽）
  { id: "dela", label: "font_dela", fontFamily: `'Dela Gothic One', ${SYSTEM_FALLBACK}` },
  // 5. Mochiy 圆滚体（肥润二次元萌感）
  { id: "mochiy", label: "font_mochiy", fontFamily: `'Mochiy Pop One', ${SYSTEM_FALLBACK}` },
  // 6. 8Bit 像素体（DotGothic16，复古游戏风格）
  { id: "pixel", label: "font_pixel", fontFamily: `'DotGothic16', ${SYSTEM_FALLBACK}` },
  // 7. 站酷快乐体（活泼动感中文）
  { id: "kuaile", label: "font_kuaile", fontFamily: `'ZCOOL KuaiLe', ${SYSTEM_FALLBACK}` },
  // 8. 站酷黄油体（圆润厚实中文）
  { id: "huangyou", label: "font_huangyou", fontFamily: `'ZCOOL QingKe HuangYou', ${SYSTEM_FALLBACK}` },
  // 9. 马善政毛笔狂草体（水墨书法风）
  { id: "brush", label: "font_brush", fontFamily: `'Ma Shan Zheng', ${SYSTEM_FALLBACK}` },
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
    localStorage.getItem("pjsk_font") || "yuruka"
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
  const [text, setText] = useState(characters[character].defaultText.text);
  const [position, setPosition] = useState({
    x: characters[character].defaultText.x,
    y: characters[character].defaultText.y,
  });
  const [fontSize, setFontSize] = useState(characters[character].defaultText.s);
  const [spaceSize, setSpaceSize] = useState(1);
  const [rotate, setRotate] = useState(characters[character].defaultText.r);
  const [curve, setCurve] = useState(false);
  const [loaded, setLoaded] = useState(false);
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

  useEffect(() => {
    setText(characters[character].defaultText.text);
    setPosition({
      x: characters[character].defaultText.x,
      y: characters[character].defaultText.y,
    });
    setRotate(characters[character].defaultText.r);
    setFontSize(characters[character].defaultText.s);
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
      ctx.fillStyle = characters[character].color;
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
      <header>
        <h1 className="visually-hidden">{t("app_title")}</h1>
      </header>
      <Info open={infoOpen} handleClose={handleClose} />

      {/* Language Selector */}
      <div className="language-selector">
        <Button
          size="small"
          variant={i18n.language === "zh" ? "contained" : "outlined"}
          onClick={() => changeLanguage("zh")}
        >
          简中
        </Button>
        <Button
          size="small"
          variant={i18n.language === "en" ? "contained" : "outlined"}
          onClick={() => changeLanguage("en")}
        >
          EN
        </Button>
        <Button
          size="small"
          variant={i18n.language === "ja" ? "contained" : "outlined"}
          onClick={() => changeLanguage("ja")}
        >
          日本語
        </Button>
      </div>


      <main className="container">
        {/* Canvas Card */}
        <div className="canvas-card">
          <div className="vertical">
            <div className="canvas">
              <Canvas
                draw={draw}
                redrawTrigger={fontLoadedVersion}
                aria-label="Project Sekai Sticker Canvas"
                role="img"
              />
            </div>
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
              min={0}
              max={256}
              step={1}
              orientation="vertical"
              track={false}
            />
          </div>
          <Slider
            className="slider-horizontal"
            value={position.x}
            onChange={(e, v) => setPosition({ ...position, x: v })}
            min={0}
            max={296}
            step={1}
            track={false}
          />
        </div>

        {/* Settings Card */}
        <div className="settings-card">
          {/* Font Selector Dropdown */}
          <FormControl fullWidth size="small" style={{ marginBottom: 16 }}>
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

          <div className="settings">
            <div>
              <label>{t("rotate")}</label>
              <Slider
                value={rotate}
                onChange={(e, v) => setRotate(v)}
                min={-10}
                max={10}
                step={0.2}
                track={false}
              />
            </div>
            <div>
              <label>{t("font_size")}</label>
              <Slider
                value={fontSize}
                onChange={(e, v) => setFontSize(v)}
                min={10}
                max={100}
                step={1}
                track={false}
              />
            </div>
            <div>
              <label>{t("spacing")}</label>
              <Slider
                value={spaceSize}
                onChange={(e, v) => setSpaceSize(v)}
                min={18}
                max={100}
                step={1}
                track={false}
              />
            </div>
            <div>
              <label>{t("curve")}</label>
              <Switch
                checked={curve}
                onChange={(e) => setCurve(e.target.checked)}
              />
            </div>
          </div>
        </div>

        {/* Text Input */}
        <div className="text" style={{ width: "100%", marginBottom: 16 }}>
          <TextField
            label={t("text_label")}
            size="small"
            value={text}
            multiline={true}
            fullWidth
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Character Picker */}
        <div className="picker">
          <Picker setCharacter={setCharacter} />
        </div>

        {/* Action Buttons */}
        <div className="buttons">
          <Button variant="outlined" onClick={copy}>
            {t("copy")}
          </Button>
          <Button variant="contained" onClick={download}>
            {t("download")}
          </Button>
        </div>

        <footer className="footer">
          <Button onClick={handleClickOpen}>{t("info")}</Button>
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
