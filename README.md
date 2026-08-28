# ⚡ Orbit Nav - 个人极简静态导航网站

> 简洁、高颜值、毫秒级冷启动的纯静态个人书签导航站。零后端依赖，开箱即用。

---

## ✨ 核心特性

- 🎨 **极简现代设计**：
  - 支持 **暗黑极客风 (Linear/Raycast)** 与 **明亮清爽风 (Notion)** 一键切换。
  - 支持 **标准卡片视图** 与 **紧凑网格视图**，满足不同密度偏好。
  - 沉浸式数字时钟、日期与动态问候语。
- 🔍 **智能多引擎聚合搜索**：
  - 按键盘 `/` 或 `Cmd+K` / `Ctrl+K` 快速聚焦搜索框。
  - 输入关键词时即时对本地所有书签进行高亮模糊过滤。
  - 支持快捷切换 **Google、百度、Bing、GitHub、Perplexity、Bilibili** 等搜索引擎，敲击回车直接全网检索。
- 📌 **完备的书签与分类管理**：
  - 页面内置可视化管理弹窗：随时新增、编辑、删除书签与分类，支持常用书签置顶（Pin）。
  - 数据自动持久化保存至浏览器 `localStorage`。
- 📦 **书签导入与备份**：
  - **导入**：支持一键导入 Chrome / Edge / Safari 导出的标准书签 HTML 文件或 JSON 备份。
  - **导出**：可随时导出 JSON 备份或标准 HTML 书签文件，跨设备无缝迁移。
- ⚡ **极致轻量 & 零依赖**：
  - 原生 HTML5 + CSS3 + ES6+ Vanilla JS，总大小 < 40KB。
  - 无需 Node.js 构建或打包，直接双击 `index.html` 即可运行。

---

## 🚀 本地使用方式

### 方式 1：直接双击打开
在访达（Finder）或文件管理器中直接双击 `index.html`，即可在默认浏览器中打开并作为浏览器主页或新标签页使用！

### 方式 2：使用本地轻量服务器运行
```bash
cd /Users/wuhen/.gemini/antigravity/scratch/my-nav
python3 -m http.server 8080
```
然后在浏览器中访问：`http://localhost:8080`

---

## ✏️ 如何修改与管理书签（2 种方式）

本项目采用**数据与页面结构分离**的设计，**无需直接修改 `index.html`**，可通过以下两种方式自由定制：

### 方式 1：网页界面直接可视化操作（⭐ 日常首选，无需改代码）
在浏览器中打开网站后，即可直接点按管理，数据会自动保存至当前浏览器 `localStorage`：
- **➕ 添加书签**：点击右上角 **「+ 添加书签」** 按钮或按快捷键 **`Alt+N`**。
- **📌 置顶 / ✏️ 编辑 / 🗑️ 删除**：将鼠标悬停在**任意书签卡片**上，卡片右上角会自动浮现操作按钮。
- **📁 分类管理**：点击页面底部 **「📁 管理分类」**，可自由新增分类、调整分类上下排序或删除分类。
- **📥 从浏览器一键导入**：从 Chrome / Edge / Safari 导出 `bookmarks.html`，在导航站右上角 **「⚙️ 设置」** -> **「📂 选择本地书签文件并导入」** 即可一键批量导入所有收藏夹。
- **📤 数据备份与迁移**：在 **「⚙️ 设置」** 中可随时导出 `JSON` 备份或标准 `HTML` 文件。

---

### 方式 2：编辑配置文件 `js/data.js`（适合部署前批量定制全站默认数据）
如果您希望将书签作为**全站默认配置**（部署到 Cloudflare 上所有人打开默认都是这一套），直接打开 [`js/data.js`](js/data.js) 文件：

```javascript
// js/data.js 结构示例：
const DEFAULT_BOOKMARKS = [
  {
    id: 'cat-ai',
    name: 'AI 生产力',
    icon: '🤖',
    items: [
      {
        id: 'bm-chatgpt',
        title: 'ChatGPT',
        url: 'https://chatgpt.com',
        desc: 'OpenAI 智能对话与多模态助手',
        icon: '',         // 👈 图标设置（支持三种方式，见下方说明）
        pinned: true      // 👈 是否置顶到该分类最前列
      },
      // 可以在此处继续添加更多书签...
    ]
  }
];
```

#### 🎨 图标 `icon` 的 3 种设置方式：
1. **留空字符串 `icon: ''`（最推荐 ⭐）**：系统会根据填写的 `url` **自动获取该网站官方的高清 Favicon Logo**（如 GitHub 猫头标、Notion 方块、ChatGPT 标等）。
2. **填写 Emoji 表情**：如 `icon: '🚀'`, `icon: '🐙'`, `icon: '📝'`（Mac 按 `Ctrl+Cmd+空格`，Windows 按 `Win+.` 可快速输入 Emoji）。
3. **填写在线图片/SVG 直链**：如 `icon: 'https://example.com/logo.svg'`。

> 💡 **生效提示**：修改 `js/data.js` 并保存后，刷新网页即可。若浏览器本地已有缓存，在网页右上角 **「⚙️ 设置」** 中点击 **「恢复默认精选书签」** 即可立即加载 `data.js` 的最新改动！

---

## 🌐 免费一键上线部署到 Cloudflare

本项目为纯静态网站，可以 100% 免费部署在 Cloudflare 上，享受全球顶级的 CDN 加速与 DDoS 防护。

### 方式 A：Cloudflare Pages 网页直接拖拽上传（最快，1分钟搞定）
1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)。
2. 在左侧菜单点击 **Workers 和 Pages** -> 点击 **创建 (Create)** -> 选择 **Pages** 标签页。
3. 点击 **上传资产 (Upload assets)**。
4. 输入项目名称（如 `my-nav`），直接将本地的 `my-nav` 文件夹拖入上传区。
5. 点击 **部署站点 (Deploy site)**，几秒钟后即可获得专属的免费域名（如 `https://my-nav.pages.dev`）。
6. （可选）可在设置中免费绑定您自己的个性化独立域名。

### 方式 B：使用 Wrangler 命令行一键部署（极客推荐）
在终端中进入项目目录直接执行：
```bash
cd /Users/wuhen/.gemini/antigravity/scratch/my-nav

# 部署到 Cloudflare Pages
npx wrangler pages deploy . --project-name=my-nav

# 或者部署到 Cloudflare Workers (已配置好 wrangler.json)
npx wrangler deploy
```

### 方式 C：关联 GitHub 自动持续部署（CI/CD）
1. 将 `my-nav` 代码推送到您的 GitHub 仓库。
2. 在 Cloudflare 控制台中选择 **Pages** -> **连接到 Git (Connect to Git)**。
3. 选中仓库，**构建设置（Build Settings）留空**（框架预设选 `None`，输出目录填写根目录 `/`）。
4. 之后每次您在 GitHub 提交或修改书签，Cloudflare 都会自动同步上线！

---

## ⌨️ 常用快捷键

| 快捷键 | 功能说明 |
| :--- | :--- |
| `/` 或 `Cmd+K` / `Ctrl+K` | 快速聚焦顶部搜索框 |
| `Enter` | 在搜索框输入内容后回车进行全网搜索 |
| `Esc` | 清空搜索内容 / 关闭当前弹窗 |
| `Alt+N` | 快速打开「添加书签」弹窗 |

---

## 📂 项目结构

```text
my-nav/
├── index.html         # 主页面结构与弹窗
├── css/
│   └── style.css      # 设计系统、主题变量、响应式布局
├── js/
│   ├── data.js        # 默认初始书签与搜索引擎配置文件
│   └── app.js         # 本地搜索、书签CRUD、主题切换与导入导出逻辑
└── README.md          # 项目说明与部署指南
```
