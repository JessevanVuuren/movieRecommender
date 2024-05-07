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

interface FilterPageProps {
  navigation: any
  route: any
}

const FilterPage: React.FC<FilterPageProps> = props => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>()
  const [show_type] = useGlobalState("showType");

  return (
    <AutocompleteDropdownContextProvider>
      <View style={styles.container}>
        <TopBar navigation={props.navigation} hambAction={"goBack"} />

        <MovieOrSeries />

        <RegionsProvider show_type={show_type} filter_options={setFilterOptions} />

        <ShowScroller navigation={props.navigation} show_type={show_type} filter_options={filterOptions} />


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
})