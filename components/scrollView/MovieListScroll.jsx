import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from "react-native";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { baseUrl342, makeURL } from "../../src/helper";
import MovieSubtitle from "../deps/MovieSubtitle";
import Colors from "../../src/style";
import Skeleton from "../Skeleton";
import React from "react";

export default class MovieListScroll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      doneLoading: false,
      currentPageCount: 0,
      megaList: [],
      pageCount: 1,
      list: new DataProvider((r1, r2) => r1 !== r2),
    };

    this.layoutProvider = new LayoutProvider(
      (i) => {
        return this.state.list.getDataForIndex(i).type;
      },
      (type, dim) => {
        switch (type) {
          case "NORMAL":
            dim.width = 100 + Dimensions.get("window").width * 0.04;
            dim.height = 200;
            break;
        }
      }
    );
  }

  componentDidMount() {
    this.loadMovies();
  }

  loadMovies = async () => {
    var json = ""

    if (this.props.master_data) {
      json = this.props.master_data;
    } else {
      const url = makeURL(this.props, this.state.pageCount);
      const getMovies = await fetch(url);
      json = await getMovies.json();
    }

    const fullList = [];
    for (let i = 0; i < json.results.length; i++) {
      if (json.results[i].poster_path != null || json.results[i].backdrop_path != null) {
        fullList.push({
          type: "NORMAL",
          item: json.results[i],
        });
      }
    }

    if (fullList.length > 0) {
      this.setState({
        list: this.state.list.cloneWithRows([...this.state.megaList, ...fullList]),
        megaList: [...this.state.megaList, ...fullList],

        doneLoading: true,
        pageCount: this.state.pageCount + 1,
        currentPageCount: json.total_pages,
      });
    }
  };

  movieToShow = async (show) => {
    if (this.props.showType === "movie") {
      console.log(show.title + ", " + show.id);
      this.props.navigation.push("MovieScreen", { jsonObject: show });
    } else {
      console.log(show.name + ", " + show.id);
      this.props.navigation.push("TvScreen", { jsonObject: show });
    }
  };

  rowRenderer = (type, data) => {
    const { poster_path, title, release_date, vote_average, first_air_date, name } = data.item;
    return (
      <View style={styles.listItem}>
        <View style={styles.skeletonHolder}>
          <Skeleton width={100} height={150} borderRadius={6} />
        </View>

        <TouchableOpacity
          onPress={() => {
            this.movieToShow(data.item);
          }}
        >
          <Image style={styles.img} source={{ uri: baseUrl342 + poster_path }} />

          <MovieSubtitle movie={data.item} props={this.props} />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    if (!this.state.doneLoading) {
      const skeletons = [];
      for (let i = 0; i < 10; i++) {
        skeletons.push(
          <View key={i}>
            <View style={{ marginLeft: "3.9%" }}>
              <View>
                <Skeleton width={100} height={150} borderRadius={6} />
              </View>
              <View style={{ marginTop: 10 }}>
                <Skeleton width={100} height={20} borderRadius={6} />
              </View>
              <View style={{ marginTop: 10 }}>
                <Skeleton width={60} height={20} borderRadius={6} />
              </View>
            </View>
          </View>
        );
      }
      return <View style={styles.skeletonRow}>{skeletons}</View>;
    }
    return (
      <View style={styles.container}>
        <RecyclerListView
          isHorizontal={true}
          style={{ flex: 1 }}
          rowRenderer={this.rowRenderer}
          dataProvider={this.state.list}
          layoutProvider={this.layoutProvider}
          onEndReached={() => {
            if (this.props.id == "actorMovieList") this.loadMovies();
          }}
          renderFooter={() => {
            return <View style={{ width: Dimensions.get("window").width * 0.04 }}></View>;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  skeletonRow: {
    flexDirection: "row",
    marginLeft: "3%",
  },
  skeletonHolder: {
    paddingLeft: Dimensions.get("window").width * 0.04,
    position: "absolute",
    zIndex: -1,
  },
  container: {
    flex: 1,
  },
  listItem: {
    paddingLeft: Dimensions.get("window").width * 0.04,
  },
  img: {
    height: 150,
    width: 100,
    borderRadius: 6,
    marginBottom: 5,
  },

  voteAverage: {
    color: Colors.textColor,
    fontSize: 16,
    marginTop: 5,
  },
});
