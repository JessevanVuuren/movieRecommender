import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown"
import { StyleSheet, View } from "react-native";
import React, { useState } from "react"
import Colors from "../src/style"
import { TopBar } from "../components/topBar";
import RegionsProvider from "../components/RegionsProvider";
import MovieOrSeries from "../components/MovieOrSeries";
import { useGlobalState } from "../global/state";
import ShowScroller from "../components/scrollView/ShowScrollerV2";
import { FilterOptions } from "../models/filter";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontText } from "../components/fontText";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ResponseModel } from "../models/response";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';


interface FilterPageProps {
  navigation: any
  route: any
}

const FilterPage: React.FC<FilterPageProps> = props => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>()
  const [results, setResults] = useState<ResponseModel>()
  const [marginTop, setMarginTop] = useState<number>()
  const [openFilter, setOpenFilter] = useState(true)
  const [show_type] = useGlobalState("showType");

  const get_filter_amount = (): number => {
    const genre = filterOptions?.genres.length | 0
    const providers = filterOptions?.provider.length | 0

    return genre + providers
  }

  return (
    <AutocompleteDropdownContextProvider>
      <View style={styles.container}>
        <TopBar navigation={props.navigation} hambAction={"goBack"} />

        <MovieOrSeries />

        <View style={styles.filterButtons} onLayout={(e) => setMarginTop(e.nativeEvent.layout.y + e.nativeEvent.layout.height + 5)}>
          <TouchableOpacity onPress={() => setOpenFilter(!openFilter)}>
            <FontText color={Colors.mainColor}>{openFilter ? "Open" : "Close"} filter options</FontText>
          </TouchableOpacity>

          {filterOptions?.provider.length > 0 && <FontText color={Colors.mainColor}>{results?.total_results} results</FontText>}
          <FontText color={Colors.mainColor}>{get_filter_amount()} filter{get_filter_amount() == 1 ? "" : "s"}</FontText>

        </View>

        {results?.total_results == 0 && filterOptions?.provider.length > 0 &&
          <View style={styles.noFilters}>
            <FontAwesome5 name="sad-cry" size={100} color="grey" />
            <FontText>No results!</FontText>
            <FontText>Change your filter options</FontText>
            <TouchableOpacity style={[styles.filterButtons, { marginBottom: 10 }]} onPress={() => setOpenFilter(!openFilter)}>
              <FontText color={Colors.mainColor}>Open filter options</FontText>
            </TouchableOpacity>
          </View>
        }


        {filterOptions?.provider.length > 0 ?
          <ShowScroller navigation={props.navigation} show_type={show_type} filter_options={filterOptions} results={setResults} />
          :
          <View style={styles.noFilters}>
            <MaterialCommunityIcons name="robot-happy-outline" size={100} color="gray" />
            <FontText>No provider selected, </FontText>
            <FontText>open filter options and discover!</FontText>
            <TouchableOpacity style={[styles.filterButtons, { marginBottom: 10 }]} onPress={() => setOpenFilter(!openFilter)}>
              <FontText color={Colors.mainColor}>Open filter options</FontText>
            </TouchableOpacity>
          </View>

        }



        <View style={{ position: "absolute", start: 0, end: 0, top: marginTop, display: openFilter ? "none" : "display" }}>
          <RegionsProvider show_type={show_type} filter_options={setFilterOptions} />
        </View>

      </View>
    </AutocompleteDropdownContextProvider>
  )
}

export default FilterPage


const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  filterButtons: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginVertical: 5,
    justifyContent: "space-between"
  },
  noFilters: {
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  }
})