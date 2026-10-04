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

const UNITS = [
  { id: "all", name: "すべて" },
  { id: "バーチャル・シンガー", name: "バーチャル・シンガー" },
  { id: "Leo/need", name: "Leo/need" },
  { id: "MORE MORE JUMP！", name: "MORE MORE JUMP！" },
  { id: "Vivid BAD SQUAD", name: "Vivid BAD SQUAD" },
  { id: "ワンダーランズ×ショウタイム", name: "ワンダーランズ×ショウタイム" },
  { id: "25時、ナイトコードで。", name: "25時、ナイトコードで。" },
];

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
  };
});

const PAGE_SIZE = 60;

export default function Picker({ setCharacter }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("all");
  const [selectedCharSlug, setSelectedCharSlug] = useState("all");
  const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);
  const listContainerRef = useRef(null);

  const handleOpen = () => {
    setOpen(true);
    setDisplayLimit(PAGE_SIZE);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // 当前组合下的角色列表
  const unitCharacters = useMemo(() => {
    if (selectedUnit === "all") return characterColors;
    return characterColors.filter((c) => c.unit === selectedUnit);
  }, [selectedUnit]);

  // 当切换组合时，若当前选中的角色不在新组合内，则重置角色筛选为 "all"
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
        title="打开贴纸选择器"
      >
        <IconCharacter />
        <span>{t("pick_character")}</span>
        <span className="picker-count-badge">758</span>
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: 20,
            background: "var(--card-bg, #ffffff)",
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.2)",
            color: "var(--text-primary, #1e293b)",
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
            borderBottom: "1px solid var(--border-color, #e2e8f0)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "1.15rem", fontWeight: 700 }}>
              {t("pick_character")}
            </span>
            <span className="picker-filter-count-pill">
              {filteredStickers.length} 枚
            </span>
          </div>

          <IconButton
            size="small"
            onClick={handleClose}
            aria-label="close"
            style={{ color: "inherit" }}
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
              placeholder={t("search_placeholder") || "搜索角色名、台词或编号..."}
              onChange={(e) => {
                setSearch(e.target.value);
                setDisplayLimit(PAGE_SIZE);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" style={{ color: "var(--pjsk-color-text-sub)" }}>
                    <IconSearch />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch("")}>
                      <IconClear />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </div>

          {/* 第一层：组合筛选栏 (全日文官方名) */}
          <div className="picker-unit-tabs">
            {UNITS.map((u) => (
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
              <span>{selectedUnit === "all" ? "全員" : "ユニット全員"}</span>
            </button>
            {unitCharacters.map((c) => {
              const isSelected = selectedCharSlug.toLowerCase() === c.slug.toLowerCase();
              return (
                <button
                  key={c.slug}
                  type="button"
                  className={`picker-char-chip ${isSelected ? "active" : ""}`}
                  style={{
                    borderColor: isSelected ? c.color : "transparent",
                  }}
                  onClick={() => handleCharChange(c.slug)}
                  title={c.nameJa}
                >
                  <span
                    className="picker-char-chip-avatar"
                    style={{ borderColor: c.color }}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}img/${c.img}`}
                      alt={c.nameJa}
                      loading="lazy"
                    />
                  </span>
                  <span className="picker-char-chip-name">{c.nameJa}</span>
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
          }}
        >
          {visibleStickers.length === 0 ? (
            <div className="picker-empty-state">
              <span>未找到匹配的贴纸</span>
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
                      setCharacter(item.originalIndex);
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
                      {item.defaultText?.text || item.name}
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
                    もっと見る ({filteredStickers.length - displayLimit} 枚残り)
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
