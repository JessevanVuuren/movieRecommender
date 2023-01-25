import { Image, StyleSheet, View, Text} from "react-native";
import { round } from "../../src/helper";
import { FontText } from "../fontText";
import Colors from "../../src/style";

const MovieSubtitle = ({ movie, props }) => {
  const { title, release_date, vote_average, first_air_date, name } = movie;
  return (
    <View >
      <FontText font={"Roboto-Bold"} fontSize={12} numberOfLines={2}>
        {props.showType === "movie" ? title : name}
      </FontText>

      <View style={styles.movieRatingRow}>
        <FontText color={Colors.mainColor} font={"Roboto-Bold"} fontSize={12}>
          {props.showType === "movie" ? release_date.split("-")[0] : first_air_date.split("-")[0]}
        </FontText>
        <View style={{ alignItems: "center", flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <Image source={require("../../assets/star-symbol.png")} style={[styles.topStar, { height: 10, width: 10 }]} />
            <FontText color={Colors.textColor} font={"Roboto-Bold"} fontSize={12}>
              {round(vote_average)}
            </FontText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MovieSubtitle;

const styles = StyleSheet.create({
  container: {},
  movieRatingRow: {
    marginBottom: 10,
    flexDirection: "row",
  },
  topStar: {
    marginTop: 3,
    marginRight: 3,
  },
});
