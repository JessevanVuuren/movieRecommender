import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Colors from '../src/style';
import React, { useEffect, useState } from "react"
import { FontText } from "./fontText";
import { WatchListModel } from "../models/watchList";

const COLORS = ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#ffff00", "#00ffff", "#ffffff"];


interface AddWatchListModalProps {
	cancel: () => {},
	edit: WatchListModel,
	create: (name: string, color: string) => {}
}

const AddWatchListModal: React.FC<AddWatchListModalProps> = props => {
	const [text, setText] = useState("")
	const [colorB, setColorB] = useState(COLORS[0])

	useEffect(() => {
		if (props.edit) {
			setColorB(COLORS.find(e => e == props.edit.color))
			setText(props.edit.name)
		}
	}, [])

	return (
		<View style={styles.container}>
			<View style={styles.title}>
				<FontText fontSize={20} font={"Roboto-Bold"}>Make Watchlist</FontText>
			</View>
			<TextInput placeholder="name" style={styles.inputName} placeholderTextColor={"#999999"} onChangeText={(t) => setText(t)} value={text} />

			<View style={styles.colors}>
				{COLORS.map(((colorID, index) => <TouchableOpacity onPress={() => setColorB(colorID)} key={index}>
					<View style={[styles.color, { backgroundColor: colorID, borderColor: colorID == colorB ? Colors.mainColor : Colors.darkLight }]}></View>
				</TouchableOpacity>))}
			</View>
			<View style={styles.buttons}>
				<TouchableOpacity style={styles.button} onPress={() => props.cancel()}>
					<FontText fontSize={20} font={"Roboto-Bold"}>Cancel</FontText>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={() => props.create(text, colorB)}>
					<FontText fontSize={20} font={"Roboto-Bold"}>{props.edit ? "Update" : "Create"}</FontText>
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
		backgroundColor: Colors.darkLight
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
	title: {
		padding: 10,
		alignItems: "center",
		backgroundColor: Colors.background_highlight,
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		marginBottom: 10,
	},
	colors: {
		margin: 10,
		justifyContent: "space-between",
		flexDirection: "row"
	},
	color: {
		borderWidth: 2,
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
		backgroundColor: Colors.background_highlight,
		borderRadius: 4,
		paddingHorizontal: 10,
		paddingVertical: 5
	}
})