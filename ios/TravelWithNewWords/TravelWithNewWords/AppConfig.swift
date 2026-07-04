import Foundation

struct WebAppConfiguration {
    let bundledFolderName: String
    let indexFileName: String
    let remoteURL: URL?

    static let `default` = WebAppConfiguration(
        bundledFolderName: "WebApp",
        indexFileName: "index",
        remoteURL: URL(string: "https://ashley2026huanhuan888ai.github.io/Travel-with-new-words/index.html")
    )
}
