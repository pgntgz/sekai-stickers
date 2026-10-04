const IconCharacter = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: 6 }}>
    <circle cx="12" cy="7" r="4" />
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
  </svg>
);
import {
  ImageList,
  ImageListItem,
  Popover,
  Button,
  TextField,
} from "@mui/material";
import { useState, useMemo } from "react";
import characters from "../characters.json";
import { useTranslation } from "react-i18next";

export default function Picker({ setCharacter }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "picker" : undefined;

  // Memoize the filtered image list items to avoid recomputing them
  // at every render
  const memoizedImageListItems = useMemo(() => {
    const s = search.toLowerCase().trim();
    // Keep track of the original index for setCharacter
    const charactersWithIndex = characters.map((c, idx) => ({ ...c, originalIndex: idx }));

    const filtered = charactersWithIndex.filter((c) => {
      if (!s) return true;
      return (
        s === c.id ||
        c.name.toLowerCase().includes(s) ||
        c.character.toLowerCase().includes(s)
      );
    });

    return filtered.map((c) => (
      <ImageListItem
        key={c.originalIndex}
        onClick={() => {
          handleClose();
          setCharacter(c.originalIndex);
        }}
        sx={{
          cursor: "pointer",
          "&:hover": {
            opacity: 0.5,
          },
          "&:active": {
            opacity: 0.8,
          },
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}img/${c.img}`}
          srcSet={`${import.meta.env.BASE_URL}img/${c.img}`}
          alt={c.name}
          loading="lazy"
        />
      </ImageListItem>
    ));
  }, [search, setCharacter]);

  return (
    <div>
      <button
        type="button"
        aria-describedby={id}
        className="btn-character-picker"
        onClick={handleClick}
      >
        <IconCharacter />
        <span>{t("pick_character")}</span>
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="modal"
      >
        {open && (
          <>
            <div className="picker-search">
              <TextField
                label={t("search_placeholder")}
                size="small"
                color="secondary"
                value={search}
                multiline={true}
                fullWidth
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="image-grid-wrapper">
              <ImageList
                sx={{
                  width: window.innerWidth < 600 ? 300 : 500,
                  height: 450,
                  overflow: "visible",
                }}
                cols={window.innerWidth < 600 ? 3 : 4}
                rowHeight={140}
                className="image-grid"
              >
                {memoizedImageListItems}
              </ImageList>
            </div>
          </>
        )}
      </Popover>
    </div>
  );
}
