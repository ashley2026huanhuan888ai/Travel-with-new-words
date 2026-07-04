# MVP Decisions

Date: 2026-07-04

## Current Direction

- First shipping surface: mobile WebApp.
- MVP loop: camera/import translation memory, knowledge search, automatic classification, review cards, and selective export.
- Next priority: real OCR path, review game, and cloud account structure.
- OCR strategy: Apple Vision native OCR is first priority; browser/local OCR and cloud OCR remain switchable adapters.
- Cloud OCR: build the interface first; do not bind a vendor yet.
- Source image upload: upload only after a cloud account is enabled.
- AI translation/explanation: prepare a real model interface next, but keep provider configuration separate.
- OCR text handling: only recommended key content becomes memory cards; all OCR text remains in source records.
- Review direction: travel diary recall mode first.
- Detail page: show every occurrence of the same word or expression across places, screenshots, and dates.
- Cloud subscription priority: AI deep explanation and large source-image storage.
- Privacy priority: addresses, QR codes, chat avatars, and nicknames.
- Deployment: continue local development for now.
- GitHub: use ashley2026huanhuan888ai/Travel-with-new-words.git.
- iOS app name: TravelWithNewWords.
- iOS minimum version: iOS 16.
- iOS loading strategy: bundle WebApp files for offline-first loading, with remote URL fallback.
