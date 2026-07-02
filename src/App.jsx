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
import getConfiguration from "./utils/config";
import log from "./utils/log";
import { useTranslation } from "react-i18next";

const { ClipboardItem } = window;

// 可选的贴纸渲染字体
const STICKER_FONTS = [
  { id: "yuruka", label: "font_yuruka", fontFamily: "YurukaStd, SSFangTangTi" },
  { id: "tangtang", label: "font_tangtang", fontFamily: "SSFangTangTi, YurukaStd" },
  { id: "huangyou", label: "font_huangyou", fontFamily: "'ZCOOL QingKe HuangYou', YurukaStd" },
  { id: "kuaile", label: "font_kuaile", fontFamily: "'ZCOOL KuaiLe', YurukaStd" },
  { id: "brush", label: "font_brush", fontFamily: "'Ma Shan Zheng', YurukaStd" },
  { id: "system", label: "font_system", fontFamily: "system-ui, sans-serif" },
];

function App() {
  const { t, i18n } = useTranslation();
  const [config, setConfig] = useState(null);

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
  };
  const currentFontFamily =
    STICKER_FONTS.find((f) => f.id === stickerFont)?.fontFamily ||
    STICKER_FONTS[0].fontFamily;

  // Config fetch
  const [rand, setRand] = useState(0);
  useEffect(() => {
    try {
      const data = async () => {
        const res = await getConfiguration();
        setConfig(res);
      };
      data();
    } catch (error) {
      console.log(error);
    }
  }, [rand]);

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

  // 当外部字体异步加载完成后，自动触发重绘 Canvas
  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setRand((r) => r + 1);
      });
    }
  }, [text, stickerFont]);

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
      ctx.font = `${fontSize}px ${currentFontFamily}`;
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

  const download = async () => {
    const canvas = document.getElementsByTagName("canvas")[0];
    const link = document.createElement("a");
    link.download = `${characters[character].name}_pjsk-sticker.png`;
    link.href = canvas.toDataURL();
    link.click();
    await log(characters[character].id, characters[character].name, "download");
    setRand(rand + 1);
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
    await log(characters[character].id, characters[character].name, "copy");
    setRand(rand + 1);
  };

  return (
    <div className="App">
      <header>
        <h1 className="visually-hidden">{t("app_title")}</h1>
      </header>
      <Info open={infoOpen} handleClose={handleClose} config={config} />

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

      <div className="counter">
        {t("total_stickers")}
        {config?.total || t("not_available")}
      </div>

      <main className="container">
        {/* Canvas Card */}
        <div className="canvas-card">
          <div className="vertical">
            <div className="canvas">
              <Canvas
                draw={draw}
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

      {/* Preheat WebFonts to avoid delayed downloading issues on Canvas */}
      <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0, overflow: 'hidden' }}>
        <span style={{ fontFamily: "'ZCOOL QingKe HuangYou'" }}>Preheat</span>
        <span style={{ fontFamily: "'ZCOOL KuaiLe'" }}>Preheat</span>
        <span style={{ fontFamily: "'Ma Shan Zheng'" }}>Preheat</span>
      </div>
    </div>
  );
}

export default App;
