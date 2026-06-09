---
trigger: always_on
---
这是一个基于 Astro 构建的 EmDash 网站，带有完整的后台管理界面。

## 命令

```bash
npx emdash dev        # 启动开发服务器（运行迁移、种子、生成类型）
npx emdash types      # 根据 schema 重新生成 TypeScript 类型
```

后台管理界面地址：`http://localhost:4321/_emdash/admin`。

## 关键文件

| 文件                     | 用途                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `astro.config.mjs`       | Astro 配置，包含 `emdash()` 集成、数据库和存储配置                    |
| `src/live.config.ts`     | EmDash loader 注册（样板代码 — 请勿修改）                           |
| `seed/seed.json`         | Schema 定义 + 演示内容（集合、字段、分类、菜单、小部件） |
| `emdash-env.d.ts`        | 自动生成的集合类型（开发服务器启动时自动生成）             |
| `src/layouts/Base.astro` | 基础布局，包含 EmDash 接线（菜单、搜索、页面贡献）                 |
| `src/pages/`             | Astro 页面 — 全部服务端渲染                                                 |
| `src/utils/media.ts`      | 外部图片和本地图片的 URL 解析器（参见「项目特定说明」）        |

## 技能

Agent 技能位于 `.agents/skills/` 目录。处理特定任务时按需加载：

- **building-emdash-site** -- 查询内容、渲染 Portable Text、schema 设计、种子文件、站点功能（菜单、小部件、搜索、SEO、评论、署名）。从这里开始。
- **creating-plugins** -- 构建 EmDash 插件，包括 hooks、存储、后台管理 UI、API 路由和 Portable Text 块类型。
- **emdash-cli** -- CLI 命令，用于内容管理、种子、类型生成和可视化编辑流程。

## 文档

EmDash 文档以 MCP 服务器形式提供，地址为 `https://docs.emdashcms.com/mcp`。需要验证 API、hook、配置选项、字段类型或模式时，请调用 `search_docs` 查询实时文档，而非依赖训练数据。文档反映当前行为，假设可能不准确。

本模板已内置 `.mcp.json`、`.cursor/mcp.json` 和 `.vscode/mcp.json`，因此 Claude Code、Cursor 和 VS Code 可自动发现文档服务器。其他工具（OpenCode、Windsurf 等）需要手动一次性设置 — 参见 [docs.emdashcms.com/docs-mcp](https://docs.emdashcms.com/docs-mcp)。

## 规则

- 所有内容页面必须服务端渲染（`output: "server"`）。CMS 内容不要使用 `getStaticPaths()`。
- 图片字段是对象（`{ src, alt }`），不是字符串。使用 `"emdash/ui"` 中的 `<Image image={...} />`。
- `entry.id` 是 slug（用于 URL）。`entry.data.id` 是数据库 ULID（用于 `getEntryTerms` 等 API 调用）。
- 查询内容的页面务必调用 `Astro.cache.set(cacheHint)`。
- 查询中的分类名必须完全匹配种子中的 `"name"` 字段（例如 `"category"` 而非 `"categories"`）。

## 本模板

一个包含文章、页面、分类、标签、全文搜索和 RSS 的博客。适用于个人写作、技术写作、独立通讯等以写作为产品的场景。编辑-科技美学风格：自信的无衬线字体克制的强调色、真实的文章结构，包含署名和阅读时间。

## 页面

| 页面        | 路径               | 内容                                                                                          |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------------------ |
| 首页        | `/`                | 精选文章头图（大图 + 摘要），最新文章网格                                          |
| 全部文章   | `/posts`           | 文章数量，完整文章列表（含摘要和标签芯片）                                              |
| 文章详情 | `/posts/[slug]`    | 头图、标题、正文、左侧元信息栏（作者 + 日期）、右侧目录 + 搜索 + 分类栏 |
| 搜索      | `/search`          | 全文搜索 UI                                                                                    |
| 页面        | `/pages/[slug]`    | 静态页面内容（Portable Text）                                                                    |
| 分类    | `/category/[slug]` | 按分类过滤的文章                                                                             |
| 标签         | `/tag/[slug]`      | 按标签过滤的文章                                                                                  |
| RSS         | `/rss.xml`         | 生成的订阅源                                                                                         |

## Schema

- `posts` 集合：`title`、`featured_image`、`content`（Portable Text）、`excerpt`（文本）。
- `pages` 集合：`title`、`content`（Portable Text）。用于 `/about` 等。
- 分类：`category`、`tag`。
- 单个 `primary` 菜单（默认包含 Home、About、Posts）。

站点设置中有 `title` 和 `tagline` — 均渲染在头部 / 页脚。

## 视觉特征

单一字体：**Inter** 用于 `--font-sans`，包括所有标题（h1/h2 使用更紧的字间距）。**JetBrains Mono** 用于 `--font-mono`，用于行内代码和代码块。正文和标题共享同一家族；字重和字号承载层级。

强调色为 `#0066cc` -- 用于链接、文章卡片标题悬停和搜索输入框聚焦环。还有次要文字颜色（`--color-text-secondary`）和 `--color-muted` 用于元信息。不要添加第二种强调色。

文章布局是亮点：三栏阅读视图，左侧元信息栏（作者署名、日期），中间 680px 正文栏，右侧边栏用于搜索、目录和分类。桌面端不要将其压成一栏 — 这种布局传达着「这是用来阅读的内容」。

## 自定义

`src/styles/theme.css` 是唯一需要编辑的文件来进行视觉更改。`Base.astro` 中的每个 CSS 变量都作为注释默认值列在那里 — 取消注释并修改以覆盖。深色模式调色板在 `Base.astro` 内部定义；`theme.css` 中的浅色模式覆盖不会影响深色模式。要自定义深色模式，请在 `theme.css` 中添加 `@media (prefers-color-scheme: dark)` 和 `:root.dark` 规则。

字体在 `astro.config.mjs` 的 `fonts:` 下配置。要更换正文字体，修改绑定到 `cssVariable: "--font-sans"` 的条目的 `name:`。推荐替代方案：Geist、IBM Plex Sans、Söhne（如果你有授权）、Public Sans。如果想要衬线正文的博客，换成人文衬线字体如 Source Serif、Crimson Pro 或 Lora — 但同时要将 `--font-size-base` 提高到 `1.0625rem` 以保证可读性。

值得了解的 CSS 变量：

- `--color-accent`, `--color-accent-hover`, `--color-on-accent`, `--color-accent-ring`
- `--color-bg`, `--color-bg-subtle`, `--color-surface`, `--color-text`, `--color-text-secondary`, `--color-muted`, `--color-border`, `--color-border-subtle`
- `--font-sans`, `--font-mono`
- `--tracking-tight` / `--tracking-snug` / `--tracking-wide` / `--tracking-wider` -- 标题和元标签使用的字间距令牌
- `--content-width` (680px) -- 文章正文栏
- `--wide-width` (1200px) -- 最大容器宽度
- `--gutter-width` (200px) -- 文章页面右侧边栏（目录）
- `--meta-col-width` (180px) -- 文章页面左侧元信息栏
- `--avatar-size-{xs,sm,md,lg}` -- 不同比例的署名头像尺寸

## 禁忌

- 不要添加第二种强调色或彩色区块背景。页面应该是黑、白、一种蓝。
- 不要用展示性无衬线字体（Bebas、Anton 等）替换 Inter。标题依赖字重对比，而非新奇字体。
- 桌面端不要折叠文章边栏 — 它是阅读体验的一部分。
- 不要使用通用博客文案（"Welcome to my blog"、"Stay tuned for more"）。写一个真实的标语，说明这个博客是关于什么的。
- 不要用三个相同的占位文章填充首页。如果只有一篇真实文章，就展示一篇真实文章。
- 没有审核计划就不要启用评论。模板默认不附带评论系统是有原因的。

## 项目特定说明

### 外部图片处理

EmDash 根据 `provider` 字段以两种格式存储图片：

- **本地图片**：`provider: "local"`，带有 `meta.storageKey` 或 `id` -- 通过 `emdash/ui` 的 `<Image />` 渲染
- **外部图片**：`provider: "external-url"`，带有 `previewUrl` -- 通过原生 `<img>` 使用 `src/utils/media.ts` 中的 `resolveImageUrl()` 渲染

选择渲染策略前务必检查 `isExternalImage()`。详见 `src/utils/media.ts` 中的实现。

### 站点自定义

- **语言**：在 `src/layouts/Base.astro` 中设置为 `zh-CN`（原为 `en`）
- **Google 翻译**：通过 `Base.astro` 中的 `<meta name="google" content="notranslate" />` 禁用
- **ICP备案号**：添加至 `src/layouts/Base.astro` 的页脚，备案号居中显示并添加 hover 效果
- **AGENTS.md 中文本地化**：项目文档 `.qoder/rules/AGENTS.md` 已翻译为中文
- **变更日志机制**：在 AGENTS.md 中建立 Change Log 表格，每次修改后记录日期、变更内容和影响文件
- **SSH 推送**：远程 URL 使用 SSH（`git@github.com:...`）

## 变更日志

| 日期 | 变更 | 文件 |
|------|--------|-------|
| 2025-06-09 | 优化备案号布局：保持footer-bottom三列居中，添加hover变色效果 | `src/layouts/Base.astro` |
| 2025-06-09 | AGENTS.md 中文本地化，更新站点自定义说明 | `.qoder/rules/AGENTS.md` |
| 2025-06-09 | 全面汉化：页面文案、日期格式、seed 数据（站点设置、菜单、分类、标签） | `src/layouts/Base.astro`, `src/pages/**/*.astro`, `seed/seed.json` |
| 2025-06-09 | 外部图片添加 width/height 属性，防止布局抖动（CLS） | `src/pages/posts/[slug].astro`, `src/components/PostCard.astro`, `src/pages/index.astro` |
| 2025-06-09 | 架构优化：提取 date.ts/constants.ts 工具函数；提取 ImageRenderer/ArchiveGrid 组件；合并 category/tag 重复代码；提取 ThemeScript 拆分 Base.astro | `src/utils/date.ts`, `src/utils/constants.ts`, `src/components/ImageRenderer.astro`, `src/components/ArchiveGrid.astro`, `src/components/layout/ThemeScript.astro`, `src/layouts/Base.astro`, `src/pages/**/*.astro` |
