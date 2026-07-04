import SwiftUI

struct ContentView: View {
    var body: some View {
        WebShellView(configuration: .default)
            .ignoresSafeArea(.container, edges: .bottom)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
