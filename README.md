# Project Sekai Stickers Maker | プロセカスタンプメーカー

> 在线制作并生成属于你自己的《世界计划 多彩舞台》PJSK 个性化表情包贴纸。  
> Create and customize your own Project Sekai (PJSK) stickers and stamps dynamically.

这是一个独立维护的 PJSK 贴纸在线生成工具

---

## 干了啥

- **性能优化**：用**Vite + React** 重新设计，相比传统 CRA 打包体积缩减 60%。
- **i18n**：集成 `react-i18next`，提供**简中**、**En**、**日文** 三语的翻译。
- **MD3视觉重塑**：重构为现代卡片、圆角胶囊按键、无极平滑滑块和沉浸式暗黑底色风格。
- **自定义贴纸字体**：原版的字体很多中文字渲染不出来，所有我除了原版的新增了可爱 `唐糖体`、以及通过 Google Fonts 加载的`黄油体`、`快乐体`和`狂草毛笔体`。
- **图像压缩**：对库中 **760+** 张图片资源进行高保真 256 色索引压缩，包体积缩减 **96.6%**（从 492MB 压缩至 16MB），保证的加载流畅度。
- *SEO优化*：重写了语义化 DOM，通过视觉隐藏清单向搜索引擎完整呈现 700+ 张贴纸内容，希望能提升收录索引排名。

---

##  本地开发

### 1. 依赖安装

```bash
npm install
```

### 2. 启动本地开发服务

```bash
npm run start
```

### 3. 生产环境打包

```bash
npm run build
```
打包产物将输出在 `build/` 目录下，可直接用于静态 Web 托管。

---

## 🐋 Docker 容器化部署

提供了完整的 Docker 与 Docker Compose 支持，非常适合在低内存（如 1GB 内存）的轻量云服务器上运行。

### 部署步骤

1. 确保将构建好的 `build/` 目录上传至 VPS 的对应目录（如 `/home/sekai-stickers/dist`）。
2. 在该目录下放置自定义 Nginx 配置文件 [nginx.conf](file:///home/pgntgz/文档/git/sekai-stickers/nginx.conf) 与 [docker-compose.yml](file:///home/pgntgz/文档/git/sekai-stickers/docker-compose.yml)。
3. 在 VPS 上启动容器：
   ```bash
   docker compose up -d
   ```

---

##  贡献

本项目是基于[开源项目](https://github.com/TheOriginalAyaka/sekai-stickers)的独立重构版本，向以下贡献者致敬：

* 最初的创意来源与网站原型：[TheOriginalAyaka](https://github.com/TheOriginalAyaka)
* 核心代码编写协助：[Modder4869](https://github.com/Modder4869)
* 初代スタンプ素材提供：[u/SherenPlaysGames](https://www.reddit.com/r/ProjectSekai/comments/x1h4v1/after_an_ungodly_amount_of_time_i_finally_made/)
* 繁琐的重构工作具体完成者： Google gemini flash 3.5

---

## 🔐 版权与开源协议

本项目代码基于 **GNU Affero General Public License v3.0 (AGPL-3.0)** 许可协议开源。

### 二次创作与游戏素材声明 (Fan Derivative Guidelines)
1. 贴图插画、角色设计、原始字样及相关知识产权均归属于 **SEGA / Colorful Palette / Crypton Future Media, INC. (Piapro)** 及相应创作者。
2. 本工具为纯粹的非商业同人二创项目，严格遵守《プロジェクトセカイ カラフルステージ！ feat. 初音ミク》官方二次利用・二次创作条例。
3. 本项目承诺**完全免费、无广告联盟、无赞助变现、无付费门槛、无盈利性跟踪**。任何二次分发或托管必须保持非商业性与源码开放。

