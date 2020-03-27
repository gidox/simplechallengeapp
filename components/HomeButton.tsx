import React from "react";
import { ScaleLinear } from "d3-scale";

import { Line, Rect } from "react-native-svg";
import { TouchableOpacity } from "react-native";

const HEIGTH = 100;
const WIDTH = 100;
const RADIUS = HEIGTH / 2;



interface HomeButtons {
  children: Any,

  onPress: () => null,
}

export default ({ children, onPress }: HomeButtons) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: WIDTH,
        height: HEIGTH,
        borderRadius: RADIUS,
        backgroundColor: '#FFF',
        borderColor: '#C0C0C0',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
      }}
    >
      {children}
    </TouchableOpacity>
  );
};
