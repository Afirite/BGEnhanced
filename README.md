# BGEnhanced

用于网易云音乐 BetterNCM 的背景增强插件。支持本地图片和视频、CSS、在线图片、随机二次元、必应每日、歌曲封面、随机抽选和遮罩背景，并提供缩放、模糊、明度、模糊过渡及背景适配设置。

![预览](./dist/preview.png)

## 安装

打包产物在 `release/` 下：

- `release/BGEnhanced.plugin`

手动把 `BGEnhanced.plugin` 整个目录放到 BetterNCM 的插件目录下。

包内有 4 个文件：`manifest.json`、`index.js`、`index.css`、`preview.png`。

## 本次重构（纯AI）

- 生命周期：清理窗口监听、尺寸计算定时器、弹窗 React 组件以及封面观察器；页面退出卸载主组件。
- 背景状态：列表和配置变化刷新当前背景；预览按 ID 对应，处理迟到结果及加载错误；媒体加载后重新计算尺寸。
- 组合背景：按当前解析路径检测循环；空随机候选和失效遮罩对象返回明确错误；随机配置变化失效缓存。
- 配置：写入带 `version: 1` 的稳定类型标识，兼容原来按类名存储的数组；只恢复已知数据字段。
- 模糊设置：模糊成为一组设置（强度 + 过渡时间 + 缩放脉冲强度），并把此前未接线的窗口缩放脉冲模糊真正接入。
- 启动加载：当前背景在插件脚本求值时即开始预加载，本地文件按路径只挂载一次，背景元素按背景 id 复用不重建。
- 本地图片优化：为图片背景生成模糊占位图掩盖加载过程，并可选择性生成缩小副本到 `.bge-cache/`（原文件不改动）。
- 性能：背景适配改为 CSS 铺满和合成层 transform，移除 resize 期间的同步布局测量/写入循环；缩放滑块支持 0.25–3.0 的连续值。

## 开发与构建

前端保留 TypeScript / React / SCSS，使用 BetterNCM 提供的全局 React、ReactDOM 和宿主 API，需要在 BetterNCM 环境中运行。

```powershell
npm ci --ignore-scripts
npm run typecheck
npm test
npm run build            # 生产构建到 dist/
npm run build:dev -- --watch   # 开发输出到根目录并监听
```

## 打包插件

```powershell
npm run pack         # 构建 dist/ + 生成 release/BGEnhanced-<版本>/ 与同名 zip
npm run pack:only    # 复用现有 dist/ 直接打包
```