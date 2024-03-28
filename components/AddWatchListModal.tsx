import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Colors from '../src/style';
import React, { useState } from "react"
import { FontText } from "./fontText";

interface AddWatchListModalProps {
	colors: string[],
	cancel: () => {},
	create: (name: string, color: string) => {}
}

const AddWatchListModal: React.FC<AddWatchListModalProps> = props => {
	const [text, setText] = useState("")
	const [colorB, setColorB] = useState(props.colors[0])

	return (
		<View style={styles.container}>
			<TextInput placeholder="Watchlist name..." style={styles.inputName} placeholderTextColor={"#999999"} onChangeText={(t) => setText(t)} />

			<View style={styles.colors}>
				{props.colors.map(((colorID, index) => <TouchableOpacity onPress={() => setColorB(colorID)} key={index}>
					<View  style={[styles.color, { backgroundColor: colorID, borderColor: colorID == colorB ? Colors.mainColor : Colors.darkLight }]}></View>
				</TouchableOpacity>))}
			</View>
			<View style={styles.buttons}>
				<TouchableOpacity style={styles.button} onPress={() => props.cancel()}>
					<FontText fontSize={20} font={"Roboto-Bold"}>Cancel</FontText>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={() => props.create(text, colorB)}>
					<FontText fontSize={20} font={"Roboto-Bold"}>Create</FontText>
				</TouchableOpacity>
			</View>

		</View>
	)
}

export default AddWatchListModal


const styles = StyleSheet.create({
	container: {
		width: "80%",
		borderRadius: 10,
		alignSelf: "center",
		backgroundColor: Colors.background
	},
	inputName: {
		color: "white",
		margin: 5,
		fontSize: 20,
		height: 50,
		borderRadius: 10,
		paddingLeft: 15,
		borderBottomWidth: 1,
		borderColor: "#999999"

	},
	colors: {
		margin: 10,
		justifyContent: "space-between",
		flexDirection: "row"
	},
	color: {
		borderWidth:2,
		borderRadius: 4,
		height: 30,
		width: 30
	},
	buttons: {
		flexDirection: "row",
		justifyContent: "space-between",
		margin: 10
	},
	button: {
		backgroundColor: Colors.darkLight,
		borderRadius: 4,
		paddingHorizontal: 10,
		paddingVertical: 5
	}
})