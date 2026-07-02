# Project Sekai Stickers Maker | プロセカスタンプメーカー

> 在线制作并生成属于你自己的《世界计划 多彩舞台》PJSK 个性化表情包贴纸。  
> Create and customize your own Project Sekai (PJSK) stickers and stamps dynamically.

本项目是一个独立维护的 PJSK 贴纸在线生成工具主仓库，基于现代化的前端技术栈进行彻底重构，拥有出色的性能体验与优雅的 Material Design 3 极简视觉设计。

---

## 🌟 核心特性

- **⚡️ 极致性能构建**：基于 **Vite + React** 重新设计，相比传统 CRA 打包体积缩减 60%，页面秒开。
- **🌐 全面多语言支持 (i18n)**：深度集成 `react-i18next`，提供**简体中文**、**English**、**日本語** 三语的完整本地化翻译。
- **🎨 MD3 (Material Design 3) 视觉重塑**：重构为现代卡片、圆角胶囊按键、无极平滑滑块和沉浸式暗黑底色风格。
- **🔤 可自定义贴纸字体**：支持中英文贴纸字体的自由切换，包含经典 `Yuruka二次元`、可爱 `唐糖体`、以及通过 Google Fonts 加载的`黄油体`、`快乐体`和`狂草毛笔体`。
- **📷 极速图像压缩**：对库中 **760+** 张图片资源进行高保真 256 色索引压缩，包体积缩减 **96.6%**（从 492MB 压缩至 16MB），保证极佳的加载流畅度。
- **🔍 强力 SEO 爬虫收录**：重写了语义化 DOM，通过视觉隐藏清单向搜索引擎完整呈现 700+ 张贴纸内容，大幅度提升收录索引排名。

---

## 🛠 本地开发与构建

### 1. 依赖安装

```bash
npm install
```

### 2. 启动本地开发服务

```bash
npm run start
```
开发服务器将默认运行在 `http://localhost:5173/pjsk/` 上（或自动分配可用端口）。

### 3. 生产环境打包

```bash
npm run build
```
打包产物将输出在 `build/` 目录下，可直接用于静态 Web 托管。

---

## 🐋 Docker 容器化部署

本项目提供了完整的 Docker 与 Docker Compose 支持，非常适合在低内存（如 1GB 内存）的轻量云服务器上运行。

### 部署步骤

1. 确保将构建好的 `build/` 目录上传至 VPS 的对应目录（如 `/home/sekai-stickers/dist`）。
2. 在该目录下放置自定义 Nginx 配置文件 [nginx.conf](file:///home/pgntgz/文档/git/sekai-stickers/nginx.conf) 与 [docker-compose.yml](file:///home/pgntgz/文档/git/sekai-stickers/docker-compose.yml)。
3. 在 VPS 上启动容器：
   ```bash
   docker compose up -d
   ```

---

## ✨ 贡献与致谢

本项目是基于开源社区的前辈作品的独立重构定制版本，向以下贡献者致敬：

* 最初的创意来源与网站原型：[TheOriginalAyaka](https://github.com/TheOriginalAyaka)
* 核心代码编写协助：[Modder4869](https://github.com/Modder4869)
* 初代スタンプ素材提供：[u/SherenPlaysGames](https://www.reddit.com/r/ProjectSekai/comments/x1h4v1/after_an_ungodly_amount_of_time_i_finally_made/)
* 新贴图扩展、多语言重构、MD3 现代化定制与本站维护：[pgntgz](https://github.com/pgntgz)

---

## 🔐 授权协议

本项目基于 **MIT License** 许可协议开源。
>>>>>>> 5137c22 (feat: 引入 6 款可选字体（集成 Google Fonts 快乐体/黄油体/狂草体），全面本地化 Info 弹窗贡献者英文信息，重构 README 品牌为独立主仓库)
