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

  const units = [
    { id: "all", label: t("unit_all") },
    { id: "バーチャル・シンガー", label: "バーチャル・シンガー" },
    { id: "Leo/need", label: "Leo/need" },
    { id: "MORE MORE JUMP！", label: "MORE MORE JUMP！" },
    { id: "Vivid BAD SQUAD", label: "Vivid BAD SQUAD" },
    { id: "ワンダーランズ×ショウタイム", label: "ワンダーランズ×ショウタイム" },
    { id: "25時、ナイトコードで。", label: "25時、ナイトコードで。" },
  ];

  const filteredCharacters = React.useMemo(() => {
    if (selectedUnit === "all") return characterColors;
    return characterColors.filter((c) => c.unit === selectedUnit);
  }, [selectedUnit]);

  const getCharName = (c) => {
    if (i18n.language.startsWith("zh")) return c.nameZh;
    if (i18n.language.startsWith("ja")) return c.nameJa;
    return c.nameEn;
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
          background: "var(--pjsk-color-surface, #14161c)",
          border: "1px solid var(--pjsk-color-border, #262936)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6)",
          color: "var(--pjsk-color-text-main, #f3f5f8)",
        },
      }}
    >
      <DialogTitle
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px 12px",
          borderBottom: "1px solid var(--pjsk-color-border, #262936)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--pjsk-color-text-main, #f3f5f8)" }}>
            {t("text_color")}
          </span>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "3px 8px",
              borderRadius: 20,
              background: "var(--pjsk-color-surface-container, #1b1d25)",
              border: "1px solid var(--pjsk-color-border, #262936)",
              fontSize: "0.78rem",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontWeight: 600,
              color: "var(--pjsk-color-text-main, #f3f5f8)",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: currentColor,
                display: "inline-block",
                border: "1.5px solid #ffffff",
                boxShadow: "0 0 2px rgba(0,0,0,0.4)",
              }}
            />
            {currentColor?.toUpperCase()}
          </div>
        </div>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="close"
          style={{ color: "var(--pjsk-color-text-secondary, #9aa0b0)" }}
        >
          <IconClose />
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ padding: "16px 20px 20px" }}>
        {/* 组合筛选栏 */}
        <div className="color-unit-tabs">
          {units.map((u) => (
            <button
              key={u.id}
              type="button"
              className={`color-unit-tab ${selectedUnit === u.id ? "active" : ""}`}
              onClick={() => setSelectedUnit(u.id)}
            >
              {u.label}
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
                      ? `0 0 0 2px var(--pjsk-color-surface, #14161c), 0 0 0 4px ${c.color}, 0 4px 14px ${c.color}77`
                      : `0 0 0 1px rgba(0,0,0,0.3), 0 2px 8px ${c.color}44`,
                  }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}${c.avatar || `avatars/${c.slug.toLowerCase()}.png`}`}
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
