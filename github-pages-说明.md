# 部署说明 · GitHub Pages

本站已发布到 GitHub Pages，网址形如：

```
https://<你的用户名>.github.io/cg-football-club/
```

## 以后怎么更新网站

改完 `index.html`、`assets/` 里的任何文件后，在这个文件夹里运行（PowerShell）：

```powershell
pwsh -File "E:\数字营销\_tools\deploy-pages.ps1"
```

脚本会自动暂存改动、提交、推送到 GitHub。推送完成后约 1 分钟，线上自动更新。

## 手动更新（等效做法）

```powershell
cd E:\数字营销\cg-fc
git add -A
git commit -m "更新网站内容"
git push
```

## 注意事项

- 主分支是 `main`，GitHub Pages 从仓库根目录发布；根目录下的 `.nojekyll` 文件必须保留。
- `assets/img/stars/` 里按 `messi.jpg`、`ronaldo.jpg` 这样的文件名放真实照片，页面会自动替换掉插画。
- 单文件版本 `standalone.html` 也一起发布了，可以直接发给别人离线打开。
