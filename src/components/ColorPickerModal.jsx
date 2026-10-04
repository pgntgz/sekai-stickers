import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import characterColors from "../characterColors.json";

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PRESET_COLORS = [
  { label: "纯白", color: "#FFFFFF" },
  { label: "极黑", color: "#1C1E21" },
  { label: "Sekai青", color: "#33CCBB" },
  { label: "活力橙", color: "#FF7722" },
  { label: "蜜桃粉", color: "#FB8AAC" },
  { label: "琉璃蓝", color: "#33AAEE" },
  { label: "柠檬黄", color: "#F5B303" },
  { label: "罗兰紫", color: "#BB88EE" },
];

const UNITS = [
  { id: "all", labelZh: "全部", labelJa: "すべて", labelEn: "All" },
  { id: "Virtual Singer", labelZh: "虚拟歌手", labelJa: "バチャシン", labelEn: "VS" },
  { id: "Leo/need", labelZh: "Leo/need", labelJa: "レオニ", labelEn: "L/n" },
  { id: "MORE MORE JUMP!", labelZh: "MMJ!", labelJa: "モモジャン", labelEn: "MMJ" },
  { id: "Vivid BAD SQUAD", labelZh: "VBS", labelJa: "ビビバス", labelEn: "VBS" },
  { id: "Wonderlands×Showtime", labelZh: "万圣秀", labelJa: "ワンダショ", labelEn: "WxS" },
  { id: "25-ji, Nightcord de.", labelZh: "25时", labelJa: "ニーゴ", labelEn: "25-ji" },
];

export default function ColorPickerModal({
  open,
  onClose,
  currentColor,
  onSelectColor,
  defaultCharacterColor,
}) {
  const { t, i18n } = useTranslation();
  const [selectedUnit, setSelectedUnit] = useState("all");
  const [hexInput, setHexInput] = useState(currentColor || "#FB8AAC");

  React.useEffect(() => {
    if (currentColor) {
      setHexInput(currentColor);
    }
  }, [currentColor]);

  const filteredCharacters = React.useMemo(() => {
    if (selectedUnit === "all") return characterColors;
    return characterColors.filter((c) => c.unit === selectedUnit);
  }, [selectedUnit]);

  const getCharName = (c) => {
    if (i18n.language.startsWith("zh")) return c.nameZh;
    if (i18n.language.startsWith("ja")) return c.nameJa;
    return c.nameEn;
  };

  const getUnitLabel = (u) => {
    if (i18n.language.startsWith("zh")) return u.labelZh;
    if (i18n.language.startsWith("ja")) return u.labelJa;
    return u.labelEn;
  };

  const handleHexChange = (e) => {
    const raw = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
    const full = `#${raw}`;
    setHexInput(full);
    if (raw.length === 6) {
      onSelectColor(full);
    }
  };

  const handleNativeColorPick = (e) => {
    const val = e.target.value;
    setHexInput(val);
    onSelectColor(val);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 20,
          background: "var(--card-bg, #ffffff)",
          boxShadow: "0 20px 48px rgba(0, 0, 0, 0.16)",
          color: "var(--text-primary, #1e293b)",
        },
      }}
    >
      <DialogTitle
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px 12px",
          borderBottom: "1px solid var(--border-color, #e2e8f0)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 650 }}>
            {t("text_color")}
          </span>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 8px",
              borderRadius: 20,
              background: "rgba(0,0,0,0.04)",
              fontSize: "0.78rem",
              fontFamily: "monospace",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: currentColor,
                display: "inline-block",
                boxShadow: "0 0 2px rgba(0,0,0,0.3)",
              }}
            />
            {currentColor?.toUpperCase()}
          </div>
        </div>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="close"
          style={{ color: "inherit" }}
        >
          <IconClose />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ padding: "16px 20px 20px" }}>
        {/* 组合筛选栏 */}
        <div className="color-unit-tabs">
          {UNITS.map((u) => (
            <button
              key={u.id}
              type="button"
              className={`color-unit-tab ${selectedUnit === u.id ? "active" : ""}`}
              onClick={() => setSelectedUnit(u.id)}
            >
              {getUnitLabel(u)}
            </button>
          ))}
        </div>

        {/* 角色头像与色环网格 */}
        <div className="character-color-grid">
          {filteredCharacters.map((c) => {
            const isSelected =
              currentColor?.toLowerCase() === c.color?.toLowerCase();
            return (
              <button
                key={c.slug}
                type="button"
                className={`char-color-card ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  onSelectColor(c.color);
                  setHexInput(c.color);
                }}
                title={`${getCharName(c)} (${c.color})`}
              >
                {/* 头像 + 专属代表色色环 */}
                <div
                  className="char-avatar-ring-wrap"
                  style={{
                    borderColor: c.color,
                    boxShadow: isSelected
                      ? `0 0 0 2px var(--card-bg, #fff), 0 0 0 4px ${c.color}, 0 4px 12px ${c.color}66`
                      : `0 0 0 1px rgba(0,0,0,0.06), 0 2px 6px ${c.color}33`,
                  }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}img/${c.img}`}
                    alt={getCharName(c)}
                    className="char-avatar-img"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div
                      className="char-color-check-badge"
                      style={{ backgroundColor: c.color }}
                    >
                      <IconCheck />
                    </div>
                  )}
                </div>
                <span className="char-color-name">{getCharName(c)}</span>
              </button>
            );
          })}
        </div>

        {/* 分割线 */}
        <div className="color-modal-divider" />

        {/* 自由调色盘部分 */}
        <div className="free-palette-section">
          <div className="free-palette-title">
            <span>{t("free_color_picker")}</span>
            {defaultCharacterColor && (
              <button
                type="button"
                className="btn-reset-char-color"
                onClick={() => {
                  onSelectColor(defaultCharacterColor);
                  setHexInput(defaultCharacterColor);
                }}
              >
                {t("reset_char_color")}
              </button>
            )}
          </div>

          <div className="free-palette-controls">
            {/* 原生拾色器预览块 */}
            <label className="native-color-picker-label" title="唤起系统调色盘">
              <input
                type="color"
                value={currentColor || "#FB8AAC"}
                onChange={handleNativeColorPick}
                className="native-color-input"
              />
              <span
                className="native-color-preview"
                style={{ backgroundColor: currentColor }}
              />
            </label>

            {/* 十六进制颜色输入框 */}
            <div className="hex-input-wrap">
              <span className="hex-hash">#</span>
              <input
                type="text"
                maxLength={6}
                value={hexInput.replace("#", "")}
                placeholder="FB8AAC"
                onChange={handleHexChange}
                className="hex-text-field"
              />
            </div>

            {/* 快速快捷纯色预设 */}
            <div className="preset-dots-wrap">
              {PRESET_COLORS.map((p) => (
                <button
                  key={p.color}
                  type="button"
                  className={`preset-dot ${currentColor?.toLowerCase() === p.color.toLowerCase() ? "active" : ""}`}
                  style={{ backgroundColor: p.color }}
                  onClick={() => {
                    onSelectColor(p.color);
                    setHexInput(p.color);
                  }}
                  title={`${p.label} (${p.color})`}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
