import React, { useState } from "react";
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
import "@mdui/icons/policy--rounded.js";
import "@mdui/icons/terminal--rounded.js";
import "@mdui/icons/arrow-drop-down--rounded.js";
import "@mdui/icons/check--rounded.js";
import "@mdui/icons/shield--rounded.js";

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
  const [guideOpen, setGuideOpen] = useState(false);

  React.useEffect(() => {
    if (open && typeof window !== 'undefined' && window.location.hash.includes('licenses')) {
      setTimeout(() => {
        const el = document.getElementById('info-licenses-section');
        if (el) el.scrollIntoView({ behavior: 'auto' });
      }, 150);
    }
  }, [open]);

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
          maxHeight: "90vh",
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

          {/* 4. 产权与许可协议 (Intellectual Property & Licenses) */}
          <div className="info-section" id="info-licenses-section">
            <div className="info-section-title">
              <mdui-icon-policy--rounded style={{ fontSize: 18, color: "var(--pjsk-color-primary)" }} />
              <span>产权与许可协议</span>
            </div>

            <div className="info-license-cards-column">
              {/* 4.1 GNU AGPL 协议 */}
              <div className="info-license-card">
                <div className="info-license-card-header">
                  <div className="info-license-badge-box">
                    <img
                      src={import.meta.env.BASE_URL + "licenses/agplv3.png"}
                      alt="GNU AGPLv3"
                      className="info-agpl-logo-img"
                    />
                  </div>
                  <div className="info-license-title-box">
                    <div className="info-license-tag-row">
                      <span className="info-badge-pill agpl">Copyleft / 强传染开源</span>
                      <a
                        href="https://www.gnu.org/licenses/agpl-3.0.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-license-link"
                      >
                        gnu.org/licenses/agpl-3.0
                        <mdui-icon-open-in-new--rounded style={{ fontSize: 14 }} />
                      </a>
                    </div>
                    <h4 className="info-license-card-heading">使用 GNU AGPL 开放源代码</h4>
                  </div>
                </div>
                <div className="info-license-card-body">
                  <p>
                    本项目的代码架构、MD3 界面系统、文案排版算法及全部前端功能遵循 <strong>GNU Affero General Public License v3.0 (AGPL-3.0)</strong> 协议开放源代码。
                  </p>
                  <p className="info-license-subnote">
                    任何人在网络服务器上托管、修改或派生本软件，均须向全体访问者公开完整对应源码，保障代码自由与开源社区共建。
                  </p>
                </div>
              </div>

              {/* 4.2 非自由资产的许可协议 */}
              <div className="info-license-card nonfree">
                <div className="info-license-card-header">
                  <div className="info-license-icon-box nonfree">
                    <img
                      src={import.meta.env.BASE_URL + "licenses/nonfreeassets.svg"}
                      alt="Non-Free Assets"
                      className="info-nonfree-svg-img"
                    />
                  </div>
                  <div className="info-license-title-box">
                    <div className="info-license-tag-row">
                      <span className="info-badge-pill nonfree">F-Droid Anti-Feature: NonFreeAssets</span>
                      <a
                        href="https://pjsekai.sega.jp/guideline/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="info-license-link amber"
                      >
                        官方二次创作指引
                        <mdui-icon-open-in-new--rounded style={{ fontSize: 14 }} />
                      </a>
                    </div>
                    <h4 className="info-license-card-heading">非自由资产的许可协议</h4>
                  </div>
                </div>
                <div className="info-license-card-body">
                  <p>
                    <strong>图像资产权利声明：</strong>项目中包含的贴纸表情包原画、游戏角色立绘、角色名、组合标识与关联音画素材的知识产权与著作权均严格归属于 <strong>SEGA / Colorful Palette / Crypton Future Media, INC.</strong> 等官方权利人所有。
                  </p>
                  <p>
                    <strong>非营利同人运营规约：</strong>本站点严格根据世嘉官方公布的 <a href="https://pjsekai.sega.jp/guideline/index.html" target="_blank" rel="noopener noreferrer" className="inline-doc-link">《プロジェクトセカイ 二次創作ガイドライン》</a> 中规定的「非营利且仅回收原材料或服务器成本（非営利かつ原材料費程度の回収・同人活動の範囲）」之条件设立并运营。本站点绝不包含任何商业牟利、付费购买或盈利性广告推广行为。
                  </p>
                </div>
              </div>

              {/* 4.3 站点定位、本地运行与隐私说明 */}
              <div className="info-license-card hosting">
                <div className="info-hosting-section-block">
                  <h4 className="info-license-card-heading">站点性质与自托管指南</h4>
                  <p className="info-hosting-p">
                    本站点主要作为该开源项目的技术预览与交互演示（Demo & Preview）。站点由维护者个人出资托管，完全非营利。由于个人服务器带宽及各地区网络环境差异，无法保证在所有环境下都能提供完美无瑕的访问体验。
                  </p>
                  <p className="info-hosting-p highlight">
                    💡 <strong>强烈建议将代码克隆至本地运行</strong>，享受最快速度、无限额度、零网络延迟与完全离线的贴纸生成体验：
                  </p>

                  {/* 本地运行折叠指南 */}
                  <div className="info-local-guide-box">
                    <button
                      type="button"
                      className="info-guide-toggle-btn"
                      onClick={() => setGuideOpen(!guideOpen)}
                    >
                      <div className="info-guide-toggle-left">
                        <mdui-icon-terminal--rounded style={{ fontSize: 18, color: "var(--pjsk-color-primary)" }} />
                        <span>本地部署与离线运行操作指南</span>
                      </div>
                      <mdui-icon-arrow-drop-down--rounded
                        style={{
                          fontSize: 20,
                          transform: guideOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.22s ease",
                        }}
                      />
                    </button>

                    {guideOpen && (
                      <div className="info-guide-code-content">
                        <div className="code-step-title">1. 克隆代码仓库并进入目录</div>
                        <pre className="info-bash-code">git clone https://github.com/pgntgz/sekai-stickers.git
cd sekai-stickers</pre>

                        <div className="code-step-title">2. 安装依赖项 (建议 Node.js 18+)</div>
                        <pre className="info-bash-code">npm install</pre>

                        <div className="code-step-title">3. 启动本地开发服务 (支持即时热更新)</div>
                        <pre className="info-bash-code">npm run dev</pre>
                        <div className="code-step-hint">终端将输出本地访问地址（通常为 http://localhost:5173/pjsk/），在浏览器打开即可完全离线使用。</div>

                        <div className="code-step-title">4. (可选) 本地编译静态包并启动预览服务</div>
                        <pre className="info-bash-code">npm run build && npm run preview</pre>
                      </div>
                    )}
                  </div>
                </div>

                {/* 同类项目推荐 */}
                <div className="info-related-projects-block">
                  <div className="info-related-title">你也可以在这些项目中取得类似的体验：</div>
                  <div className="info-related-chips">
                    <a href="https://stickers.ayaka.one/" target="_blank" rel="noopener noreferrer" className="info-related-chip">
                      <span>Sekai Stickers (Original)</span>
                      <mdui-icon-open-in-new--rounded style={{ fontSize: 13 }} />
                    </a>
                    <a href="https://sekai.best/" target="_blank" rel="noopener noreferrer" className="info-related-chip">
                      <span>Sekai Viewer (sekai.best)</span>
                      <mdui-icon-open-in-new--rounded style={{ fontSize: 13 }} />
                    </a>
                    <a href="https://bestdori.com/" target="_blank" rel="noopener noreferrer" className="info-related-chip">
                      <span>Bestdori (bestdori.com)</span>
                      <mdui-icon-open-in-new--rounded style={{ fontSize: 13 }} />
                    </a>
                    <a href="https://pjsekai.sega.jp/" target="_blank" rel="noopener noreferrer" className="info-related-chip">
                      <span>Project Sekai 官方网站</span>
                      <mdui-icon-open-in-new--rounded style={{ fontSize: 13 }} />
                    </a>
                  </div>
                </div>

                {/* 匿名统计与广告拦截自由 */}
                <div className="info-privacy-analytics-block" >
                  <div className="info-privacy-header">
                    <mdui-icon-shield--rounded style={{ fontSize: 16, color: "var(--pjsk-color-text-secondary)" }} />
                    <span>关于匿名数据统计与拦截自由</span>
                  </div>
                  <p className="info-privacy-text">
                    本站点仅通过 <strong>Cloudflare Web Analytics</strong> 收集极少量的基本匿名体验与性能数据（仅用于分析页面渲染耗时与基础 PV，不记录任何个人身份信息，不植入任何追踪 Cookie）。
                  </p>
                  <p className="info-privacy-text">
                    在绝大多数保护隐私的环境中，此类请求会被拦截。本站完全尊重您的个人隐私与选择权，您可以通过 <a href="https://ublockorigin.com/" target="_blank" rel="noopener noreferrer" className="inline-doc-link">uBlock Origin (uBO)</a>、防追踪类 DNS（如 <a href="https://www.quad9.net/" target="_blank" rel="noopener noreferrer" className="inline-doc-link">Quad9 9.9.9.9</a> 或 AdGuard DNS）等任何您喜欢的方式予以屏蔽，站点的所有贴纸制作功能均可 100% 正常运行。
                  </p>
                </div>
              </div>
            </div>
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
