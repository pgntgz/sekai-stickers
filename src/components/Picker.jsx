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
      <Button
        aria-describedby={id}
        variant="outlined"
        onClick={handleClick}
      >
        {t("pick_character")}
      </Button>
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
