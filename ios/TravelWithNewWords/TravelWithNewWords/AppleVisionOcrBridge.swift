import Foundation
import UIKit
import Vision
import WebKit

final class AppleVisionOcrBridge: NSObject, WKScriptMessageHandler {
    static let messageName = "appleVisionOcr"

    private weak var webView: WKWebView?

    init(webView: WKWebView) {
        self.webView = webView
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard
            let payload = message.body as? [String: Any],
            let requestId = payload["requestId"] as? String,
            let imageDataUrl = payload["imageDataUrl"] as? String,
            let image = imageFromDataUrl(imageDataUrl),
            let cgImage = image.cgImage
        else {
            reject(requestId: (message.body as? [String: Any])?["requestId"] as? String ?? "", message: "Invalid OCR payload")
            return
        }

        let request = VNRecognizeTextRequest { [weak self] request, error in
            if let error {
                self?.reject(requestId: requestId, message: error.localizedDescription)
                return
            }

            let observations = (request.results as? [VNRecognizedTextObservation]) ?? []
            let blocks = observations.enumerated().compactMap { index, observation -> [String: Any]? in
                guard let candidate = observation.topCandidates(1).first else { return nil }
                let box = observation.boundingBox
                return [
                    "id": "block-apple-\(index + 1)",
                    "text": candidate.string,
                    "confidence": candidate.confidence,
                    "language": "auto",
                    "level": Self.level(for: candidate.string),
                    "box": [
                        "x": box.origin.x,
                        "y": 1 - box.origin.y - box.height,
                        "width": box.width,
                        "height": box.height
                    ]
                ]
            }

            self?.resolve(requestId: requestId, result: ["blocks": blocks])
        }

        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = true
        request.recognitionLanguages = payload["recognitionLanguages"] as? [String] ?? ["ja-JP", "en-US", "zh-Hans"]

        DispatchQueue.global(qos: .userInitiated).async {
            do {
                try VNImageRequestHandler(cgImage: cgImage, options: [:]).perform([request])
            } catch {
                self.reject(requestId: requestId, message: error.localizedDescription)
            }
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
            self?.webView?.evaluateJavaScript("window.\(functionName).apply(window, \(json));")
        }
    }

    private func imageFromDataUrl(_ dataUrl: String) -> UIImage? {
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
