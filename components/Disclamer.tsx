import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../src/style";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontText } from "./fontText";
import { LinearGradient } from "expo-linear-gradient";

interface DisclaimerProps {
  closeDisclaimer: () => void
}

const Disclaimer: React.FC<DisclaimerProps> = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.popup}>
        <View>
          <View style={styles.disclaimerContainer}>
            <FontText fontSize={35} font={"Roboto-Bold"}>
              Disclaimer
            </FontText>
            <Image style={styles.disclaimerImage} source={require("../assets/icon.png")} />
          </View>
        </View>

        <View style={styles.disclaimerText}>
          <FontText fontSize={17} font={"Roboto-Bold"} lineHeight={23}>
            Hey there! Just a quick friendly heads up that this app is designed to provide information about movies and TV shows, but it's not
            intended for watching them. So while you can browse and discover all sorts of interesting titles, you won't actually be able to stream or
            download anything directly from here. Thanks for understanding, and happy browsing!{" "}
          </FontText>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={props.closeDisclaimer}>
            <FontText fontSize={20} font={"Roboto-Bold"}>
              Okay
            </FontText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Disclaimer;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.87)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical:20,
    backgroundColor: Colors.background,
    // backgroundColor: "green",

    width: "85%",
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    marginTop: 30,
    paddingRight:10,
    justifyContent:"flex-end"
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: Colors.mainColor,
    height: 40,
    width: 100,
  },
  disclaimerContainer: {
    flexDirection: "row",
    
    justifyContent: "space-between",
  },
  disclaimerImage: {
    height: 40,
    width: 40,
  },
  disclaimerText: {
    marginTop: 15,
  },
});
