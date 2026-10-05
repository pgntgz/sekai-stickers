import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import characters from "../characters.json";
import characterColors from "../characterColors.json";
import { useTranslation } from "react-i18next";

const IconCharacter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: 6 }}>
    <circle cx="12" cy="7" r="4" />
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconClear = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// 建立 slug -> characterColors 字典，以小写为 key
const CHAR_MAP = {};
for (const item of characterColors) {
  CHAR_MAP[item.slug.toLowerCase()] = item;
}

// 预先给全部 758 张贴纸绑定原始索引与所属组合
const STICKERS_WITH_META = characters.map((c, idx) => {
  const meta = CHAR_MAP[c.character.toLowerCase()] || {};
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

const IconChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const PAGE_SIZE = 60;

export default function Picker({ setCharacter, currentCharacter, onSelectSticker }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("all");
  const [selectedCharSlug, setSelectedCharSlug] = useState("all");
  const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);
  const listContainerRef = useRef(null);

  const units = [
    { id: "all", name: t("unit_all") },
    { id: "バーチャル・シンガー", name: "バーチャル・シンガー" },
    { id: "Leo/need", name: "Leo/need" },
    { id: "MORE MORE JUMP！", name: "MORE MORE JUMP！" },
    { id: "Vivid BAD SQUAD", name: "Vivid BAD SQUAD" },
    { id: "ワンダーランズ×ショウタイム", name: "ワンダーランズ×ショウタイム" },
    { id: "25時、ナイトコードで。", name: "25時、ナイトコードで。" },
  ];

  // 当前主界面生效的角色专属信息（用于一级菜单直观展示当前头像与名称）
  const activeCharMeta = useMemo(() => {
    if (!currentCharacter) return null;
    const meta = CHAR_MAP[currentCharacter.character?.toLowerCase()] || {};
    const name = i18n.language.startsWith("zh")
      ? (meta.nameZh || currentCharacter.name)
      : (i18n.language.startsWith("ja") ? (meta.nameJa || currentCharacter.name) : (meta.nameEn || currentCharacter.character));
    return {
      name,
      color: meta.color || currentCharacter.color || "#33CCBB",
      avatar: meta.avatar || `avatars/${(meta.slug || currentCharacter.character).toLowerCase()}.png`,
      unit: meta.unit,
      stickerName: currentCharacter.name,
      stickerText: currentCharacter.defaultText?.text,
    };
  }, [currentCharacter, i18n.language]);

  const handleOpen = () => {
    setOpen(true);
    setDisplayLimit(PAGE_SIZE);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCharName = (c) => {
    if (i18n.language.startsWith("zh")) return c.nameZh;
    if (i18n.language.startsWith("ja")) return c.nameJa;
    return c.nameEn;
  };

  // 当前组合下的角色列表
  const unitCharacters = useMemo(() => {
    if (selectedUnit === "all") return characterColors;
    return characterColors.filter((c) => c.unit === selectedUnit);
  }, [selectedUnit]);

  // 当切换组合时，重置角色筛选为 "all"
  const handleUnitChange = (unitId) => {
    setSelectedUnit(unitId);
    setSelectedCharSlug("all");
    setDisplayLimit(PAGE_SIZE);
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  };

  const handleCharChange = (slug) => {
    setSelectedCharSlug(slug);
    setDisplayLimit(PAGE_SIZE);
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  };

  // 综合筛选贴纸：支持团队过滤、角色过滤、全字段搜索（中/日/英/台词/编号）
  const filteredStickers = useMemo(() => {
    const s = search.trim().toLowerCase();

    return STICKERS_WITH_META.filter((item) => {
      // 1. 团队筛选
      if (selectedUnit !== "all" && item.unit !== selectedUnit) {
        return false;
      }

      // 2. 角色筛选
      if (selectedCharSlug !== "all" && item.character.toLowerCase() !== selectedCharSlug.toLowerCase()) {
        return false;
      }

      // 3. 搜索词筛选
      if (s) {
        const matchName = item.name.toLowerCase().includes(s);
        const matchChar = item.character.toLowerCase().includes(s);
        const matchJa = item.nameJa.toLowerCase().includes(s);
        const matchZh = item.nameZh.toLowerCase().includes(s);
        const matchEn = item.nameEn.toLowerCase().includes(s);
        const matchText = item.defaultText?.text?.toLowerCase().includes(s);
        const matchId = String(item.id).toLowerCase() === s;
        return matchName || matchChar || matchJa || matchZh || matchEn || matchText || matchId;
      }

      return true;
    });
  }, [search, selectedUnit, selectedCharSlug]);

  const visibleStickers = useMemo(() => {
    return filteredStickers.slice(0, displayLimit);
  }, [filteredStickers, displayLimit]);

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + PAGE_SIZE);
  };

  return (
    <div>
      <button
        type="button"
        className="btn-character-picker"
        onClick={handleOpen}
        title={`${t("pick_character")} - ${activeCharMeta ? activeCharMeta.name : ""}`}
        style={activeCharMeta ? { "--char-theme-color": activeCharMeta.color } : {}}
      >
        {activeCharMeta ? (
          <div className="picker-trigger-inner">
            <div
              className="picker-trigger-avatar-ring"
              style={{
                borderColor: activeCharMeta.color,
                boxShadow: `0 0 10px ${activeCharMeta.color}44`,
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}${activeCharMeta.avatar}`}
                alt={activeCharMeta.name}
                className="picker-trigger-avatar-img"
              />
            </div>
            <div className="picker-trigger-meta">
              <div className="picker-trigger-top-row">
                <span className="picker-trigger-name" style={{ color: activeCharMeta.color }}>
                  {activeCharMeta.name}
                </span>
                {activeCharMeta.unit && (
                  <span className="picker-trigger-unit-badge">{activeCharMeta.unit}</span>
                )}
              </div>
              <div className="picker-trigger-sub">
                <span className="picker-trigger-sticker-name">{activeCharMeta.stickerName}</span>
                {activeCharMeta.stickerText && (
                  <span className="picker-trigger-quote-preview">
                    「{activeCharMeta.stickerText}」
                  </span>
                )}
              </div>
            </div>
            <div className="picker-trigger-action-pill">
              <span className="picker-trigger-action-text">{t("pick_character")}</span>
              <span className="picker-count-badge">758</span>
              <IconChevronRight />
            </div>
          </div>
        ) : (
          <>
            <IconCharacter />
            <span>{t("pick_character")}</span>
            <span className="picker-count-badge">758</span>
          </>
        )}
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 20,
            background: "var(--pjsk-color-surface, #14161c)",
            border: "1px solid var(--pjsk-color-border, #262936)",
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6)",
            color: "var(--pjsk-color-text-main, #f3f5f8)",
            maxHeight: "88vh",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* 顶部标题栏 */}
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
            <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--pjsk-color-text-main, #f3f5f8)" }}>
              {t("pick_character")}
            </span>
            <span className="picker-filter-count-pill">
              {filteredStickers.length} {t("count_unit")}
            </span>
          </div>

          <IconButton
            size="small"
            onClick={handleClose}
            aria-label="close"
            style={{ color: "var(--pjsk-color-text-secondary, #9aa0b0)" }}
          >
            <IconClose />
          </IconButton>
        </DialogTitle>

        {/* 搜索框与两层分类筛选栏 (Sticky 控制区) */}
        <div className="picker-controls-header">
          {/* 搜索栏 */}
          <div className="picker-search-bar">
            <TextField
              size="small"
              fullWidth
              value={search}
              placeholder={t("search_placeholder")}
              onChange={(e) => {
                setSearch(e.target.value);
                setDisplayLimit(PAGE_SIZE);
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "var(--pjsk-color-surface-container, #1b1d25)",
                  color: "var(--pjsk-color-text-main, #f3f5f8)",
                  borderRadius: "var(--pjsk-radius-pill, 9999px)",
                  "& fieldset": {
                    borderColor: "var(--pjsk-color-border, #262936)",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--pjsk-color-border-hover, #3b3f52)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--pjsk-color-primary, #00f5d4)",
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "var(--pjsk-color-text-secondary, #9aa0b0)",
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ color: "var(--pjsk-color-text-secondary, #9aa0b0)" }}>
                    <IconSearch />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch("")} style={{ color: "var(--pjsk-color-text-secondary, #9aa0b0)" }}>
                      <IconClear />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </div>

          {/* 第一层：组合筛选栏 (全日文官方名) */}
          <div className="picker-unit-tabs">
            {units.map((u) => (
              <button
                key={u.id}
                type="button"
                className={`picker-unit-tab ${selectedUnit === u.id ? "active" : ""}`}
                onClick={() => handleUnitChange(u.id)}
              >
                {u.name}
              </button>
            ))}
          </div>

          {/* 第二层：角色头像快捷筛选栏 (带专属色环) */}
          <div className="picker-character-chips-bar">
            <button
              type="button"
              className={`picker-char-chip ${selectedCharSlug === "all" ? "active" : ""}`}
              onClick={() => handleCharChange("all")}
            >
              <span>{selectedUnit === "all" ? t("all_characters") : t("all_unit_characters")}</span>
            </button>
            {unitCharacters.map((c) => {
              const isSelected = selectedCharSlug.toLowerCase() === c.slug.toLowerCase();
              const charName = getCharName(c);
              return (
                <button
                  key={c.slug}
                  type="button"
                  className={`picker-char-chip ${isSelected ? "active" : ""}`}
                  style={{
                    borderColor: isSelected ? c.color : "transparent",
                  }}
                  onClick={() => handleCharChange(c.slug)}
                  title={charName}
                >
                  <span
                    className="picker-char-chip-avatar"
                    style={{ borderColor: c.color }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${c.avatar || `avatars/${c.slug.toLowerCase()}.png`}`}
                      alt={charName}
                      loading="lazy"
                    />
                  </span>
                  <span className="picker-char-chip-name">{charName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 贴纸展示网格 */}
        <DialogContent
          ref={listContainerRef}
          style={{
            padding: "16px 20px 24px",
            overflowY: "auto",
            flex: 1,
            background: "var(--pjsk-color-surface, #14161c)",
          }}
        >
          {visibleStickers.length === 0 ? (
            <div className="picker-empty-state">
              <span>{t("no_stickers_found")}</span>
            </div>
          ) : (
            <>
              <div className="picker-sticker-grid">
                {visibleStickers.map((item) => (
                  <button
                    key={item.originalIndex}
                    type="button"
                    className="picker-sticker-card"
                    style={{
                      "--hover-color": item.charColor,
                    }}
                    onClick={() => {
                      if (onSelectSticker) {
                        onSelectSticker(item.originalIndex);
                      } else {
                        setCharacter(item.originalIndex);
                      }
                      handleClose();
                    }}
                    title={`${item.name} - ${item.defaultText?.text || ""}`}
                  >
                    <div className="picker-sticker-img-wrap">
                      <img
                        src={`${import.meta.env.BASE_URL}img/${item.img}`}
                        alt={item.name}
                        loading="lazy"
                      />
                    </div>
                    <span className="picker-sticker-caption">
                      {item.defaultText?.text || getCharName(item)}
                    </span>
                  </button>
                ))}
              </div>

              {/* 加载更多按钮（如果尚未全部展示） */}
              {displayLimit < filteredStickers.length && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <button
                    type="button"
                    className="picker-load-more-btn"
                    onClick={handleLoadMore}
                  >
                    {t("load_more")} ({t("remaining")} {filteredStickers.length - displayLimit} {t("count_unit")})
                  </button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
