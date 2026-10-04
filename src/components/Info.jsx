import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export default function Info({ open, handleClose }) {
  const { t } = useTranslation();

  return (
    <div>
    <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">{t("info_title")}</DialogTitle>
    <DialogContent>
    <DialogContentText id="alert-dialog-description" component="div">
    <Typography variant="h6" component="h3">
    {t("made_possible_by")}
    </Typography>
    <List>
    <ListItem
    button
    onClick={() =>
      (window.location.href = "https://github.com/theoriginalayaka")
    }
    >
    <ListItemAvatar>
    <Avatar
    alt="Ayaka"
    src="https://avatars.githubusercontent.com/theoriginalayaka"
    />
    </ListItemAvatar>
    <ListItemText
    primary="Ayaka"
    secondary={t("contrib_ayaka")}
    />
    </ListItem>
    <ListItem
    button
    onClick={() =>
      (window.location.href = "https://github.com/modder4869")
    }
    >
    <ListItemAvatar>
    <Avatar
    alt="Modder4869"
    src="https://avatars.githubusercontent.com/modder4869"
    />
    </ListItemAvatar>
    <ListItemText
    primary="Modder4869"
    secondary={t("contrib_modder")}
    />
    </ListItem>
    <ListItem
    button
    onClick={() =>
      (window.location.href =
      "https://www.reddit.com/r/ProjectSekai/comments/x1h4v1/after_an_ungodly_amount_of_time_i_finally_made/")
    }
    >
    <ListItemAvatar>
    <Avatar
    alt="u/SherenPlaysGames"
    src="https://styles.redditmedia.com/t5_mygft/styles/profileIcon_n1kman41j5891.jpg"
    />
    </ListItemAvatar>
    <ListItemText
    primary="u/SherenPlaysGames"
    secondary={t("contrib_sheren")}
    />
    </ListItem>
    <ListItem
    button
    onClick={() =>
      (window.location.href =
      "https://github.com/TheOriginalAyaka/sekai-stickers/graphs/contributors")
    }
    >
    <ListItemAvatar>
    <Avatar
    alt="Contributors"
    src="https://avatars.githubusercontent.com/u/583231"
    />
    </ListItemAvatar>
    <ListItemText
    primary="Contributors"
    secondary={t("contrib_contributors")}
    />
    </ListItem>
    <ListItem
    button
    onClick={() =>
      (window.location.href = "https://antigravity.google")
    }
    >
    <ListItemAvatar>
    <Avatar
    alt="Google Antigravity"
    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%230f172a'/><stop offset='100%25' stop-color='%23020617'/></linearGradient></defs><rect width='100' height='100' rx='50' fill='url(%23bg)'/><ellipse cx='50' cy='68' rx='28' ry='8' fill='none' stroke='%234285F4' stroke-width='3' opacity='0.7'/><ellipse cx='50' cy='52' rx='20' ry='6' fill='none' stroke='%2334A853' stroke-width='2.5' opacity='0.85'/><path d='M50 20 L66 48 L34 48 Z' fill='%23EA4335'/><circle cx='50' cy='36' r='5' fill='%23FBBC05'/><polygon points='50,13 54,23 50,20 46,23' fill='%23ffffff'/></svg>"
    />
    </ListItemAvatar>
    <ListItemText
    primary="Google Antigravity (AI Agent)"
    secondary={t("contrib_antigravity")}
    />
    </ListItem>
    <ListItem
    button
    onClick={() =>
      (window.location.href = "https://chouxiang.world")
    }
    >
    <ListItemAvatar>
    <Avatar
    alt="抽象世界"
    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='cx' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%2300f5d4'/><stop offset='100%25' stop-color='%237928ca'/></linearGradient></defs><rect width='100' height='100' rx='50' fill='%23161821'/><rect x='22' y='26' width='56' height='42' rx='10' fill='url(%23cx)'/><polygon points='34,68 34,78 48,68' fill='%237928ca'/><circle cx='40' cy='47' r='4' fill='%23ffffff'/><circle cx='50' cy='47' r='4' fill='%23ffffff'/><circle cx='60' cy='47' r='4' fill='%23ffffff'/></svg>"
    />
    </ListItemAvatar>
    <ListItemText
    primary="抽象世界 (chouxiang.world)"
    secondary={t("contrib_chouxiang")}
    />
    </ListItem>
    {/* 这里是 Master 的信息！ */}
    <ListItem
    button
    onClick={() => (window.location.href = "https://github.com/pgntgz")}
    >
    <ListItemAvatar>
    <Avatar
    alt="pgntgz"
    src="https://avatars.githubusercontent.com/pgntgz?size=100"
    />
    </ListItemAvatar>
    <ListItemText
    primary="pgntgz"
    secondary={
      <>
      {t("contrib_pgntgz_1")}<br />
      {t("contrib_pgntgz_2")}
      </>
    }
    />
    </ListItem>
    </List>
    <Typography variant="h6" component="h3">
    {t("source_code_contrib")}
    </Typography>
    <List>
    <ListItem
    button
    onClick={() =>
      (window.location.href =
      "https://github.com/TheOriginalAyaka/sekai-stickers")
    }
    >
    <ListItemAvatar>
    <Avatar
    alt="GitHub"
    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    />
    </ListItemAvatar>
    <ListItemText primary="GitHub" secondary={t("link_original_code")} />
    </ListItem>
    {/* 这里是 Master 的 fork 链接！ */}
    <ListItem
    button
    onClick={() =>
      (window.location.href = "https://github.com/pgntgz/sekai-stickers")
    }
    >
    <ListItemAvatar>
    <Avatar
    alt="GitHub"
    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    />
    </ListItemAvatar>
    <ListItemText primary="GitHub" secondary={t("link_fork_code")} />
    </ListItem>
    </List>
    <Typography variant="h6" component="h3">
    {t("discord_bot")}
    </Typography>
    <List>
    <ListItem
    button
    onClick={() =>
      (window.location.href = "http://link.ayaka.one/stbot")
    }
    >
    <ListItemAvatar>
    <Avatar
    alt="Discord"
    src="https://cdn.discordapp.com/embed/avatars/0.png"
    />
    </ListItemAvatar>
    <ListItemText
    primary="Sekai Stickers"
    secondary={t("bot_slogan")}
    />
    </ListItem>
    </List>
    </DialogContentText>
    </DialogContent>
      <DialogActions>
      <Button onClick={handleClose} color="secondary" autoFocus>
      {t("close")}
      </Button>
      </DialogActions>
      </Dialog>
      </div>
  );
}

