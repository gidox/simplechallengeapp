import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Initial from "../screens/Initial";
import AddClient from "../screens/AddClient";
import EditClient from "../screens/EditClient";

import AuthNavigation from "./AuthNavigation";
import AppNavigation from "./AppNavigation";

const SwitchNavigator = createSwitchNavigator(
  {
    Initial: Initial,
    Auth: AuthNavigation,
    AddClient: AddClient,
    EditClient: EditClient,

    App: AppNavigation
  },
  {
    initialRouteName: "Initial"
  }
);

const AppContainer = createAppContainer(SwitchNavigator);

export default AppContainer;
