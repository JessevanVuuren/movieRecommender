import MovieListVerticalScroll from "../components/scrollView/MovieListVerticalScroll";
import { StyleSheet, Text, View } from "react-native";
import { TopBar } from "../components/topBar";
import Colors from "../src/style"
import React, { } from "react"

interface ExtraShowsListProps {
	navigation: any;
	route: any;
}

const ExtraShowsList: React.FC<ExtraShowsListProps> = props => {


	return (
		<View style={styles.container}>
			<TopBar navigation={props.navigation} hambAction={"goBack"} />
			<MovieListVerticalScroll id={props.route.params.sort_type} video_id={props.route.params.key} navigation={props.navigation} showType={props.route.params.show_type} component={[]} />
		</View>
	)
}

export default ExtraShowsList


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background
	},
})