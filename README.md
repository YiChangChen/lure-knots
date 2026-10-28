# 路亞綁結圖解（iOS App）

Expo（React Native）專案。用 `react-native-svg` 繪製六個路亞常用結的逐步圖解。

## 專案結構

- `src/app/index.tsx`：首頁（選結流程圖、結強度比較、通用要點）
- `src/app/knot/[id].tsx`：單一線結的逐步圖解
- `src/data/knots.ts`：線結資料與每一步的圖形指令
- `src/components/KnotDiagram.tsx`：把圖形指令畫成 SVG
- `src/learned.tsx`：「已學會」紀錄（存在手機上）

## 方法一：用 Expo Go 立刻在 iPhone 上試用（免費）

1. iPhone 從 App Store 安裝 **Expo Go**
2. 電腦和 iPhone 連同一個 Wi‑Fi，在專案資料夾執行：
   ```
   npx expo start
   ```
3. 用 iPhone 相機掃描終端機顯示的 QR code，就會在 Expo Go 裡開啟

連不上時可改用 `npx expo start --tunnel`。

## 方法二：打包成可安裝的 iOS App（EAS Build）

Windows 無法直接編譯 iOS，所以用 Expo 的雲端打包服務。安裝到實機需要 Apple Developer 帳號（每年 US$99）。

```
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest device:create                     # 登記要安裝的 iPhone
npx eas-cli@latest build --platform ios --profile preview
```

打包完成後，用 iPhone 打開 EAS 給的連結就能安裝。要上架 App Store 則用：

```
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios
```

`app.json` 裡的 `ios.bundleIdentifier`（目前是 `com.lureknots.app`）在打包前改成你自己的反向網域名稱，例如 `com.你的名字.lureknots`。

## 檢查

```
npx tsc --noEmit
npx expo lint
```
