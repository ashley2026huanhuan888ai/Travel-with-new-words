# Apple Vision OCR Bridge

The WebApp remains the first product surface, but true Apple OCR requires an iOS native wrapper because Safari/PWA JavaScript cannot directly call Vision.

## Web to Native Message

The WebApp sends this message to `window.webkit.messageHandlers.appleVisionOcr`:

```json
{
  "requestId": "apple-vision-...",
  "sourceImageId": "img-...",
  "sourceName": "menu.jpg",
  "mimeType": "image/jpeg",
  "imageDataUrl": "data:image/jpeg;base64,...",
  "recognitionLanguages": ["ja-JP", "en-US", "zh-Hans"]
}
```

## Native to Web Callback

The iOS wrapper should call one of these JavaScript callbacks:

```js
window.__resolveTravelMemoryAppleVisionOcr(requestId, {
  blocks: [
    {
      id: "block-1",
      text: "特製味噌ラーメン",
      confidence: 0.96,
      language: "ja",
      level: "expression",
      box: { "x": 0.14, "y": 0.2, "width": 0.58, "height": 0.12 }
    }
  ]
});

window.__rejectTravelMemoryAppleVisionOcr(requestId, "OCR failed");
```

## Product Rule

- Only recommended key blocks become memory cards.
- All OCR text remains attached to the source image record.
- If the iOS bridge is unavailable, the WebApp falls back to local simulated OCR so the current prototype remains usable.
