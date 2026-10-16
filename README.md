# BGEnhanced

用于网易云音乐 BetterNCM 的背景增强插件。支持本地图片和视频、CSS、在线图片和歌曲封面，并提供缩放、模糊、明度、模糊过渡及背景适配设置。

![预览](./preview.png)

## 安装
从`release`下载`BGEnhanced.plugin`

手动把 `BGEnhanced.plugin` 放到 BetterNCM 的插件目录下。

包内有 4 个文件：`manifest.json`、`index.js`、`index.css`、`preview.jpg`。

## 本次重构

- 生命周期：清理窗口监听、尺寸计算定时器、弹窗 React 组件以及封面观察器；页面退出卸载主组件。
- 模糊设置：界面缩放时会进行短暂的模糊背景（强度 + 过渡时间 + 缩放脉冲强度）。
- 启动加载：当前背景在插件脚本求值时即开始预加载，本地文件按路径只挂载一次，背景元素按背景 id 复用不重建。
- 性能：背景适配改为 CSS 铺满和合成层 transform，移除 resize 期间的同步布局测量/写入循环；缩放滑块支持 0.25–3.0 的连续值。

## 开发与构建

```powershell
npm ci --ignore-scripts
npm run typecheck
npm test
npm run build            # 生产构建到 dist/
npm run build:dev -- --watch   # 开发输出到根目录并监听
```
## 打包插件

```powershell
npm run pack         # 构建 dist/ + 生成 release/BGEnhanced-<版本>
npm run release:patch   # 版本 +1 并打包：0.3.15 -> 0.3.16
```