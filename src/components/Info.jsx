import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { useTranslation } from "react-i18next";
import "@mdui/icons/info--rounded.js";
import "@mdui/icons/close--rounded.js";
import "@mdui/icons/groups--rounded.js";
import "@mdui/icons/code--rounded.js";
import "@mdui/icons/open-in-new--rounded.js";
import "@mdui/icons/smart-toy--rounded.js";
import "@mdui/icons/check--rounded.js";

const CONTRIBUTORS = [
  {
    id: "pgntgz",
    name: "pgntgz",
    tag: "Maintainer",
    roleKey: "contrib_pgntgz_master",
    descKey: "contrib_pgntgz_desc",
    avatar: "https://avatars.githubusercontent.com/pgntgz?size=100",
    url: "https://github.com/pgntgz",
    isMaster: true,
  },
  {
    id: "ayaka",
    name: "Ayaka",
    tag: "Creator",
    roleKey: "contrib_ayaka_role",
    descKey: "contrib_ayaka",
    avatar: "https://avatars.githubusercontent.com/theoriginalayaka",
    url: "https://github.com/theoriginalayaka",
  },
  {
    id: "antigravity",
    name: "Google Antigravity",
    tag: "AI Agent",
    roleKey: "contrib_antigravity_role",
    descKey: "contrib_antigravity",
    avatarSvg: true,
    url: "https://antigravity.google",
  },
  {
    id: "chouxiang",
    name: "抽象世界",
    tag: "Community",
    roleKey: "contrib_chouxiang_role",
    descKey: "contrib_chouxiang",
    avatarChouxiang: true,
    url: "https://chouxiang.world",
  },
  {
    id: "modder",
    name: "Modder4869",
    tag: "Contributor",
    roleKey: "contrib_modder_role",
    descKey: "contrib_modder",
    avatar: "https://avatars.githubusercontent.com/modder4869",
    url: "https://github.com/modder4869",
  },
  {
    id: "sheren",
    name: "SherenPlaysGames",
    tag: "Resource",
    roleKey: "contrib_sheren_role",
    descKey: "contrib_sheren",
    avatar: "https://styles.redditmedia.com/t5_mygft/styles/profileIcon_n1kman41j5891.jpg",
    url: "https://www.reddit.com/r/ProjectSekai/comments/x1h4v1/after_an_ungodly_amount_of_time_i_finally_made/",
  },
  {
    id: "community",
    name: "GitHub Contributors",
    tag: "Community",
    roleKey: "contrib_community_role",
    descKey: "contrib_contributors",
    avatar: "https://avatars.githubusercontent.com/u/583231",
    url: "https://github.com/TheOriginalAyaka/sekai-stickers/graphs/contributors",
  },
];

export default function Info({ open, handleClose }) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 28,
          background: "var(--pjsk-color-surface-container, #172126)",
          border: "1px solid var(--pjsk-color-border, #2c363c)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6)",
          color: "var(--pjsk-color-text-main, #d9e4eb)",
          maxHeight: "88vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* 头部 (MD3 Dialog Header) */}
      <DialogTitle
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--pjsk-color-border, #2c363c)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(51, 204, 187, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--pjsk-color-primary, #33CCBB)",
            }}
          >
            <mdui-icon-info--rounded style={{ fontSize: 22 }} />
          </div>
          <div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--pjsk-color-text-main)" }}>
              {t("info_title")}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--pjsk-color-text-tertiary)", marginTop: 2 }}>
              Project Sekai Stickers Maker • MD3 Expressive Edition
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="info-close-btn"
          aria-label={t("close")}
        >
          <mdui-icon-close--rounded style={{ fontSize: 20 }} />
        </button>
      </DialogTitle>

      {/* 滚动内容区 (MD3 Dialog Body) */}
      <DialogContent style={{ padding: "20px 24px", overflowY: "auto" }}>
        <div className="info-layout-wrapper">
          {/* 1. 项目简介卡片 (Hero Card) */}
          <div className="info-card-block info-hero-banner">
            <div className="info-hero-header">
              <span className="info-hero-badge">Fan Made</span>
              <span className="info-hero-title">世界计划 多彩舞台！表情包工坊</span>
            </div>
            <p className="info-hero-desc">
              自由搭配文案台词、实时微调旋转字号与文字弯曲、挑选全 26 位角色官方代表色，一键导出高清表情包图片或复制到剪贴板。
            </p>
            <div className="info-hero-tags">
              <span className="info-tag-item">758+ 官方贴纸</span>
              <span className="info-tag-item">26 角色官方色</span>
              <span className="info-tag-item">12 款精选字体</span>
              <span className="info-tag-item">Material 3 设计</span>
            </div>
          </div>

          {/* 2. 核心主创与贡献者 */}
          <div className="info-section">
            <div className="info-section-title">
              <mdui-icon-groups--rounded style={{ fontSize: 18, color: "var(--pjsk-color-primary)" }} />
              <span>{t("made_possible_by")}</span>
            </div>

            <div className="info-contributors-grid">
              {CONTRIBUTORS.map((c) => (
                <a
                  key={c.id}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`info-contributor-card ${c.isMaster ? "master-card" : ""}`}
                >
                  <div className="info-card-avatar-wrap">
                    {c.avatarSvg ? (
                      <svg
                        className="info-avatar-img"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id="antigravity_bg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0f172a" />
                            <stop offset="100%" stopColor="#020617" />
                          </linearGradient>
                        </defs>
                        <rect width="100" height="100" rx="50" fill="url(#antigravity_bg)" />
                        <ellipse cx="50" cy="68" rx="28" ry="8" fill="none" stroke="#4285F4" strokeWidth="3" opacity="0.7" />
                        <ellipse cx="50" cy="52" rx="20" ry="6" fill="none" stroke="#34A853" strokeWidth="2.5" opacity="0.85" />
                        <path d="M50 20 L66 48 L34 48 Z" fill="#EA4335" />
                        <circle cx="50" cy="36" r="5" fill="#FBBC05" />
                        <polygon points="50,13 54,23 50,20 46,23" fill="#ffffff" />
                      </svg>
                    ) : c.avatarChouxiang ? (
                      <svg
                        className="info-avatar-img"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id="cx_bg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00f5d4" />
                            <stop offset="100%" stopColor="#7928ca" />
                          </linearGradient>
                        </defs>
                        <rect width="100" height="100" rx="50" fill="#161821" />
                        <rect x="22" y="26" width="56" height="42" rx="10" fill="url(#cx_bg)" />
                        <polygon points="34,68 34,78 48,68" fill="#7928ca" />
                        <circle cx="40" cy="47" r="4" fill="#ffffff" />
                        <circle cx="50" cy="47" r="4" fill="#ffffff" />
                        <circle cx="60" cy="47" r="4" fill="#ffffff" />
                      </svg>
                    ) : (
                      <img src={c.avatar} alt={c.name} className="info-avatar-img" loading="lazy" />
                    )}
                  </div>

                  <div className="info-card-text">
                    <div className="info-card-name-row">
                      <span className="info-card-name">{c.name}</span>
                      <span className={`info-badge-pill ${c.isMaster ? "master" : ""}`}>{c.tag}</span>
                    </div>
                    <div className="info-card-desc">
                      {c.isMaster ? (
                        <>
                          <div>{t("contrib_pgntgz_1")}</div>
                          <div>{t("contrib_pgntgz_2")}</div>
                        </>
                      ) : (
                        t(c.descKey)
                      )}
                    </div>
                  </div>

                  <mdui-icon-open-in-new--rounded class="info-card-ext-icon" />
                </a>
              ))}
            </div>
          </div>

          {/* 3. 开源仓库与生态 */}
          <div className="info-section">
            <div className="info-section-title">
              <mdui-icon-code--rounded style={{ fontSize: 18, color: "var(--pjsk-color-primary)" }} />
              <span>{t("source_code_contrib")}</span>
            </div>

            <div className="info-repo-grid">
              <a
                href="https://github.com/pgntgz/sekai-stickers"
                target="_blank"
                rel="noopener noreferrer"
                className="info-repo-card active-repo"
              >
                <div className="info-repo-header">
                  <div className="info-repo-title-wrap">
                    <span className="info-repo-tag">Current / 活跃主干</span>
                    <span className="info-repo-title">pgntgz/sekai-stickers</span>
                  </div>
                  <mdui-icon-open-in-new--rounded class="info-repo-icon" />
                </div>
                <div className="info-repo-desc">{t("link_fork_code")}</div>
              </a>

              <a
                href="https://github.com/TheOriginalAyaka/sekai-stickers"
                target="_blank"
                rel="noopener noreferrer"
                className="info-repo-card"
              >
                <div className="info-repo-header">
                  <div className="info-repo-title-wrap">
                    <span className="info-repo-tag upstream">Upstream / 原版</span>
                    <span className="info-repo-title">TheOriginalAyaka/sekai-stickers</span>
                  </div>
                  <mdui-icon-open-in-new--rounded class="info-repo-icon" />
                </div>
                <div className="info-repo-desc">{t("link_original_code")}</div>
              </a>

              <a
                href="http://link.ayaka.one/stbot"
                target="_blank"
                rel="noopener noreferrer"
                className="info-repo-card"
              >
                <div className="info-repo-header">
                  <div className="info-repo-title-wrap">
                    <span className="info-repo-tag bot">Discord Bot</span>
                    <span className="info-repo-title">Sekai Stickers Bot</span>
                  </div>
                  <mdui-icon-open-in-new--rounded class="info-repo-icon" />
                </div>
                <div className="info-repo-desc">{t("bot_slogan")}</div>
              </a>
            </div>
          </div>

          {/* 4. 版权与同人声明 */}
          <div className="info-disclaimer-box">
            <p>
              免责声明：本网站为粉丝非营利同人衍生工具。Project Sekai 游戏图像、角色形象及相关商标版权均归属于 SEGA / Colorful Palette / Crypton Future Media, INC. 所有。
            </p>
          </div>
        </div>
      </DialogContent>

      {/* 底部按钮栏 (MD3 Dialog Actions) */}
      <DialogActions
        style={{
          padding: "14px 24px 18px",
          borderTop: "1px solid var(--pjsk-color-border, #2c363c)",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          onClick={handleClose}
          className="info-footer-btn"
        >
          <mdui-icon-check--rounded style={{ fontSize: 16, marginRight: 6 }} />
          <span>{t("close")}</span>
        </button>
      </DialogActions>
    </Dialog>
  );
}
