# 《戀愛大作戰：心動日記》

一款以原創角色及校園青春戀愛為主題的 Anime 風格瀏覽器養成遊戲。採用原生 HTML、CSS、JavaScript，不需要後端、不需要安裝套件，也不需要編譯。

## 遊戲功能

- 三位原創女主角：朝霧陽菜、水瀨澪、藤宮小春
- 校園日常行動：溫習、籃球、羽毛球、美術社、打工、休息
- 角色對話與分支選擇，選擇會改變好感度與能力值
- 打字機式逐字對話、顯示全文、AUTO 劇情自動播放與鍵盤操作
- 角色專屬事件、禮物、約會和告白
- 手機訊息、心動日記、回憶圖鑑
- 兩款限時迷你遊戲：接球挑戰、羽毛球反應測試
- 七種結局判定：三位角色各自的好結局與普通結局，以及友情成長結局
- LocalStorage 自動存檔、繼續遊戲、保留已解鎖結局收藏
- 適配桌面、平板與手機瀏覽器
- 核心遊戲不依賴第三方 CDN 或伺服器

## 檔案結構

```text
love-strategy-heartbeat-diary/
├── index.html
├── style.css
├── game.js
├── README.md
├── .nojekyll
└── assets/
    ├── art-gallery.jpg
    ├── cover-school.jpg
    ├── hina-portrait.jpg
    ├── mio-portrait.jpg
    ├── koharu-portrait.jpg
    ├── scene-campus.jpg
    ├── scene-classroom.jpg
    ├── scene-gym.jpg
    ├── scene-library.jpg
    └── scene-sunset.jpg
```

## 在電腦上開啟

直接用瀏覽器打開 `index.html` 即可遊玩。部分瀏覽器對 `file://` 網址的本機儲存行為可能不同；建議以 GitHub Pages 網址遊玩，便可以使用正常網站來源的 LocalStorage。

## 發布到 GitHub Pages

1. 在 GitHub 建立一個新的 Repository。
2. 將本專案資料夾內的所有檔案和 `assets` 資料夾上傳到 Repository 的**根目錄**。確認 `index.html` 不要再放在額外的子資料夾內。
3. 在 Repository 頁面進入 **Settings → Pages**。
4. 在 **Build and deployment** 裡，將 Source 設為 **Deploy from a branch**。
5. 將 Branch 設為 `main`，資料夾選 `/ (root)`，然後按 Save。
6. 等待 GitHub Pages 完成發布；網址通常會是 `https://你的GitHub帳號.github.io/Repository名稱/`。
7. 開啟網站，按「開始新故事」開始遊玩。之後可在標題畫面按「繼續遊戲」載入本機存檔。

## 注意事項

- 存檔存在目前瀏覽器及網站來源的 LocalStorage，不會自動跨裝置同步。
- 若更換瀏覽器、清除網站資料或使用無痕模式，存檔可能無法保留。
- 專案使用原創角色設定和為此遊戲準備的 Anime 概念插畫；沒有直接包含《青春之箱》的官方角色或官方美術資產。
- 所有遊戲系統都以純前端方式實作，沒有帳號、線上排行榜或雲端存檔。

## 開發檢查

- JavaScript 語法檢查：`node --check game.js`
- 開發流程 smoke test 已涵蓋：開始新遊戲、對話選擇、數值變化、專屬事件、禮物、約會、迷你遊戲計分、設定保存、結局解鎖及繼續遊戲。
- 資源使用相對路徑，以支援 GitHub Pages 專案子路徑。
- 無 npm、建置工具或第三方執行時依賴。
