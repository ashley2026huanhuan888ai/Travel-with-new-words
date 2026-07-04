# Travel with New Words

Mobile WebApp prototype for Chinese travelers who use camera translation abroad and want every useful word, phrase, expression, source image, place, and travel memory organized for later review.

## Current MVP

- Camera/import translation memory flow.
- Local IndexedDB storage for memories, source images, and offline queue.
- Selective export to CSV, Markdown, and QQ/WeChat travel memory book draft.
- OCR provider switcher with Apple Vision bridge, browser OCR, cloud interface, and local fallback.
- AI explanation adapter prepared for a real model provider.
- Travel diary review mode.

## Product Direction

- First surface: mobile WebApp.
- Real OCR path: Apple Vision through an iOS native wrapper.
- Memory generation: only recommended key content becomes memory cards; all OCR text stays attached to source records.
- Cloud subscription priorities: AI deep explanations and large source-image storage.
- Privacy priorities: addresses, QR codes, chat avatars, and nicknames.

## Local Preview

Open:

```text
http://localhost:4174/index.html?v=6
```

If the local server is not running, serve this folder with any static server.
