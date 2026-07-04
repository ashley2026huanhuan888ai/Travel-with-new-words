import SwiftUI
import WebKit

struct WebShellView: UIViewRepresentable {
    let configuration: WebAppConfiguration

    func makeCoordinator() -> Coordinator {
        Coordinator(configuration: configuration)
    }

    func makeUIView(context: Context) -> WKWebView {
        let userContentController = WKUserContentController()
        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.userContentController = userContentController
        webConfiguration.allowsInlineMediaPlayback = true

        let webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = context.coordinator
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.allowsBackForwardNavigationGestures = true

        if #available(iOS 16.4, *) {
            webView.isInspectable = true
        }

        let ocrBridge = AppleVisionOcrBridge(webView: webView)
        context.coordinator.ocrBridge = ocrBridge
        userContentController.add(ocrBridge, name: AppleVisionOcrBridge.messageName)

        context.coordinator.loadPreferredWebApp(in: webView)
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    static func dismantleUIView(_ webView: WKWebView, coordinator: Coordinator) {
        webView.configuration.userContentController.removeScriptMessageHandler(forName: AppleVisionOcrBridge.messageName)
    }

    final class Coordinator: NSObject, WKNavigationDelegate {
        let configuration: WebAppConfiguration
        var ocrBridge: AppleVisionOcrBridge?
        private var hasTriedRemoteFallback = false

        init(configuration: WebAppConfiguration) {
            self.configuration = configuration
        }

        func loadPreferredWebApp(in webView: WKWebView) {
            if let webAppFolderURL = Bundle.main.resourceURL?.appendingPathComponent(configuration.bundledFolderName),
               let indexURL = Bundle.main.url(
                   forResource: configuration.indexFileName,
                   withExtension: "html",
                   subdirectory: configuration.bundledFolderName
               ) {
                webView.loadFileURL(indexURL, allowingReadAccessTo: webAppFolderURL)
                return
            }
            loadRemoteFallback(in: webView)
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            loadRemoteFallback(in: webView)
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            loadRemoteFallback(in: webView)
        }

        private func loadRemoteFallback(in webView: WKWebView) {
            guard !hasTriedRemoteFallback, let remoteURL = configuration.remoteURL else { return }
            hasTriedRemoteFallback = true
            webView.load(URLRequest(url: remoteURL))
        }
    }
}
