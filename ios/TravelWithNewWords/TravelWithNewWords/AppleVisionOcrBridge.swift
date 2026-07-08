import Foundation
import ImageIO
import UIKit
import Vision
import WebKit

final class AppleVisionOcrBridge: NSObject, WKScriptMessageHandler {
    static let messageName = "appleVisionOcr"

    private weak var webView: WKWebView?
    private let defaultRecognitionLanguages = ["ja-JP", "en-US", "zh-Hans", "zh-Hant", "ko-KR"]

    init(webView: WKWebView) {
        self.webView = webView
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        let payload = message.body as? [String: Any]
        let requestId = payload?["requestId"] as? String ?? ""
        guard
            !requestId.isEmpty,
            let payload,
            let imageDataUrl = payload["imageDataUrl"] as? String,
            let image = Self.imageFromDataUrl(imageDataUrl),
            let cgImage = image.cgImage
        else {
            if !requestId.isEmpty {
                reject(requestId: requestId, message: "Apple Vision OCR 请求缺少可识别的图片数据。")
            }
            return
        }

        let sourceName = payload["sourceName"] as? String ?? "来源图片"
        let orientation = CGImagePropertyOrientation(image.imageOrientation)
        let request = VNRecognizeTextRequest { [weak self] request, error in
            if let error {
                self?.reject(requestId: requestId, message: error.localizedDescription)
                return
            }

            let observations = (request.results as? [VNRecognizedTextObservation]) ?? []
            let blocks = Self.blocks(from: observations)
            if blocks.isEmpty {
                self?.reject(requestId: requestId, message: "Apple Vision OCR 未识别到文字：\(sourceName)")
                return
            }

            let activeLanguages = (request as? VNRecognizeTextRequest)?.recognitionLanguages ?? []
            self?.resolve(
                requestId: requestId,
                result: [
                    "blocks": blocks,
                    "sourceName": sourceName,
                    "recognitionLanguages": activeLanguages
                ]
            )
        }

        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = true
        applyRecognitionLanguages(from: payload, to: request)

        DispatchQueue.global(qos: .userInitiated).async {
            do {
                try VNImageRequestHandler(cgImage: cgImage, orientation: orientation, options: [:]).perform([request])
            } catch {
                self.reject(requestId: requestId, message: error.localizedDescription)
            }
        }
    }

    private func applyRecognitionLanguages(from payload: [String: Any], to request: VNRecognizeTextRequest) {
        let requested = (payload["recognitionLanguages"] as? [String])?.filter { !$0.isEmpty } ?? defaultRecognitionLanguages
        let supported = (try? request.supportedRecognitionLanguages()) ?? []
        let usable = requested.filter { supported.contains($0) }
        if !usable.isEmpty {
            request.recognitionLanguages = usable
        }
    }

    private func resolve(requestId: String, result: [String: Any]) {
        callJavaScript(functionName: "__resolveTravelMemoryAppleVisionOcr", arguments: [requestId, result])
    }

    private func reject(requestId: String, message: String) {
        callJavaScript(functionName: "__rejectTravelMemoryAppleVisionOcr", arguments: [requestId, message])
    }

    private func callJavaScript(functionName: String, arguments: [Any]) {
        guard
            JSONSerialization.isValidJSONObject(arguments),
            let data = try? JSONSerialization.data(withJSONObject: arguments),
            let json = String(data: data, encoding: .utf8)
        else { return }

        DispatchQueue.main.async { [weak self] in
            self?.webView?.evaluateJavaScript(
                "if (window.\(functionName)) { window.\(functionName).apply(window, \(json)); }"
            )
        }
    }

    private static func blocks(from observations: [VNRecognizedTextObservation]) -> [[String: Any]] {
        observations.enumerated().compactMap { index, observation -> [String: Any]? in
            guard let candidate = observation.topCandidates(1).first else { return nil }
            let text = candidate.string.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !text.isEmpty else { return nil }
            let box = observation.boundingBox
            return [
                "id": "block-apple-\(index + 1)",
                "text": text,
                "translationHint": "",
                "confidence": Double(candidate.confidence),
                "language": "auto",
                "level": Self.level(for: text),
                "box": [
                    "x": box.origin.x,
                    "y": 1 - box.origin.y - box.height,
                    "width": box.width,
                    "height": box.height
                ]
            ]
        }
    }

    private static func imageFromDataUrl(_ dataUrl: String) -> UIImage? {
        guard let commaIndex = dataUrl.firstIndex(of: ",") else { return nil }
        let base64 = String(dataUrl[dataUrl.index(after: commaIndex)...])
        guard let data = Data(base64Encoded: base64) else { return nil }
        return UIImage(data: data)
    }

    private static func level(for text: String) -> String {
        if text.count <= 4 { return "word" }
        if text.count <= 14 { return "phrase" }
        return "sentence"
    }
}

private extension CGImagePropertyOrientation {
    init(_ orientation: UIImage.Orientation) {
        switch orientation {
        case .up:
            self = .up
        case .upMirrored:
            self = .upMirrored
        case .down:
            self = .down
        case .downMirrored:
            self = .downMirrored
        case .left:
            self = .leftMirrored
        case .leftMirrored:
            self = .left
        case .right:
            self = .rightMirrored
        case .rightMirrored:
            self = .right
        @unknown default:
            self = .up
        }
    }
}
