import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FontText } from "./fontText";
import Colors from '../src/style';
import React from "react"

interface DeleteItemModalProps {
	cancel: () => {},
	title: string,
	delete: () => {}
}

const DeleteItemModal: React.FC<DeleteItemModalProps> = props => {
	return (
		<View style={styles.container}>
			<View style={styles.title}>

			<FontText fontSize={20} font={"Roboto-Bold"}>Delete: {props.title}</FontText>
			</View>

			<View style={styles.buttons}>
				<TouchableOpacity style={styles.button} onPress={() => props.delete()}>
					<FontText fontSize={20} font={"Roboto-Bold"}>Delete</FontText>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={() => props.cancel()}>
					<FontText fontSize={20} font={"Roboto-Bold"}>Cancel</FontText>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default DeleteItemModal


const styles = StyleSheet.create({
	container: {
		width: "80%",
		borderRadius: 10,
		alignSelf: "center",
		backgroundColor: Colors.background
	},
	title: {
		padding: 10,
		alignItems: "center",
		backgroundColor:Colors.darkLight,
		borderTopRightRadius:10,
		borderTopLeftRadius: 10,
		marginBottom:10,
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