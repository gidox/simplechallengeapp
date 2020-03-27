import React from "react";
import { Provider as ProviderPaper } from "react-native-paper";

import AppContainer from "./navigation";
import Firebase, { FirebaseProvider } from "./config/Firebase";
import { StateProvider } from "./context/store";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <StateProvider>
      <ProviderPaper>

        <FirebaseProvider value={Firebase}>
          <AppContainer />
        </FirebaseProvider>

      </ProviderPaper>
    </StateProvider>
  );
}
