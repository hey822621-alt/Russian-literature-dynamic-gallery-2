# 俄罗斯文学的流动画廊

以文学情节对应独立油画的中俄双语数字展厅。

- 五位作家：普希金、果戈里、陀思妥耶夫斯基、托尔斯泰、契诃夫。
- **14 部主要作品、47 幅独立画作**，按已确认的作品及情节映射；《彼得堡故事集》按单篇展示。
- Cover Flow 作家画廊、方向键与拖拽切换、作品情节缩略图、点击放大、轻柔自动播放、画内雪/雾/光影微动画。
- 中文优先采用仿宋，俄语采用 Times New Roman；含中俄语言切换与减少动态效果支持。
- 动效参考 Motion Primitives 的 Carousel、In View 与 Text Effect **设计理念**，为便于独立部署使用原生 CSS/JS 实现，不声称直接使用 React 组件库。
- 旧网站概念画均未带入；源文件图像来源可查 `artwork-sources.json`。

## 本地运行

```bash
npm run build
npm run preview
```

浏览器打开 <http://localhost:4173> 。无需安装第三方 npm 依赖；需 Node.js 20+。

## Cloudflare Workers（与之前的部署方式兼容）

已有 Cloudflare Workers GitHub 自动部署的项目，根目录设为 `/`：

- **Build command**：`npm run build`
- **Deploy command**：`npx wrangler deploy`
- 配置文件：`wrangler.jsonc`，静态资源目录为 `dist`。

注意：若你现有 Workers 项目名称不是 `russian-literature-gallery`，请调整 `wrangler.jsonc` 中 `name`，以免部署到另一个 Worker。构建与上线是两个不同步骤；运行 `npm run build` 不会自动发布到 Cloudflare。

## Cloudflare Pages

- **Build command**：`npm run build`
- **Build output directory**：`dist`
- **Root directory**：`/`

若使用 Pages Direct Upload，可直接将 `dist` 文件夹中的内容上传。

## 文件说明

- `src/data.json`：所有作家、作品、情节的中俄双语索引与图像路径。
- `src/main.js`、`src/styles.css`、`src/index.template.html`：交互代码与页面视觉。
- `public/images/art/`：47 幅 webp 原创插画（保留完整画面，不是旧版场景裁切）。
- `artwork-sources.json`：图片源文件对照记录（仅用于核查）。
- `dist/`：运行 `npm run build` 后生成的构建产物（另附可直接上传 Cloudflare Pages 的静态部署 ZIP）。

## 文学和美术说明

画面以文学故事的艺术化诠释为主。《死魂灵》的个别外省场景、《地下室手记》等画作属于主题型表达；《安娜·卡列尼娜》等画面包含戏剧化再现。尚未逐幅完成独立的服饰、季节、建筑历史考据，因此不应把插画当作史料。你已明确选择的五幅《樱桃园》插画保留原貌。

## 本次交互定稿（Motion Primitives 风格参考）

- Cover Flow 支持鼠标/触摸拖拽跟随与松手回弹，左右箭头和方向键也可切换作家。
- 作品切换栏使用单一滑动选中底纹，支持键盘左右方向键及 Home/End。
- 画作交替载入时缓慢交叉淡化；情节缩略图可点选，画作可点击放大；进场元素依滚动渐显。
- 自动播放仅在当前展厅进入视野时运行，悬停或聚焦暂停；系统开启减少动态效果时停用连续动画。
- 页面样式借鉴 Motion Primitives 的交互设计原则，**未安装、嵌入或声称使用其 React 组件源码**；本站无需安装额外运行依赖。

2026-10-20：候选 22 幅已按用户确认纳入正式画廊，另保留此前已定稿的情节插画，共 47 幅。
