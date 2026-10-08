# 一键更新 GitHub Pages 上的网站
# 用法：pwsh -File "E:\数字营销\cg-fc\tools\deploy-pages.ps1"
$ErrorActionPreference = 'Stop'

$tools = $PSScriptRoot                 # cg-fc\tools
$site  = Split-Path -Parent $tools     # cg-fc
$gh    = 'C:\Program Files\GitHub CLI\gh.exe'

Set-Location $site

# 1) 同步单文件离线版
node (Join-Path $tools 'single.mjs') | Out-Null

# 2) 有改动才提交
$changes = git status --porcelain
if (-not $changes) {
  Write-Output '没有改动，无需更新。'
  exit 0
}

git add -A
git commit -m "更新网站内容 $(Get-Date -Format 'yyyy-MM-dd HH:mm')" | Out-Null
git push | Out-Null

Write-Output '已推送，GitHub Pages 约 1 分钟后自动更新。'
try {
  $url = & $gh api 'repos/{owner}/{repo}/pages' --jq '.html_url' 2>$null
  if ($url) { Write-Output ("线上地址：" + $url) }
} catch { }
