import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { base_url_342, genres, get_providers, get_regions } from "../src/fetcher"
import { getValue, setValue } from '../src/LocalStorage'
import { ProvidersModel } from '../models/providers'
import React, { useEffect, useState } from "react"
import { RegionsModel } from "../models/regions"
import { Image, StyleSheet, View } from "react-native"
import { getLocales } from 'expo-localization'
import Colors from "../src/style"
import { FontText } from './fontText';
import { FilterOptions } from '../models/filter';
import { ScrollView } from 'react-native-gesture-handler';


import { Genres } from '../models/genres';

interface RegionsProviderProps {
  show_type: string
  filter_options: (filter_options: FilterOptions) => void
}


const RegionsProvider: React.FC<RegionsProviderProps> = props => {
  const [providerItems, setProviderItems] = useState<ProvidersModel[]>([])
  const [regionItems, setRegionItems] = useState<RegionsModel[]>([])
  const [genresItems, setGenresItems] = useState<Genres[]>([])

  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedRegion, setSelectedRegion] = useState<RegionsModel>()
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  const [providerMap, setProviderMap] = useState<{ [key: string]: ProvidersModel }>()
  const [genresMap, setGenresMap] = useState<{ [key: string]: Genres }>()

  useEffect(() => { setup() }, [])

  useEffect(() => { update_provider() }, [props.show_type])

  useEffect(() => {
    if (selectedRegion?.iso_3166_1 == undefined) return
    props.filter_options({ provider: selectedProviders, region: selectedRegion.iso_3166_1, genres: selectedGenres })
  }, [props.show_type, selectedProviders, selectedGenres])

  const get_region_form_local = async () => {
    const region = await getValue("region")
    if (region) return region
    else {
      const local_region = getLocales()[0].regionCode
      if (local_region != "") return local_region
      else return "US"
    }
  }

  const setup = async () => {
    const country_code = await get_region_form_local()

    const regions = await get_regions()
    setRegionItems(regions)

    const saved_region = regions.find(region => region.iso_3166_1 == country_code)
    if (saved_region) setSelectedRegion(saved_region)

    const providers = await get_providers(country_code, props.show_type)
    const mapping_provider: { [key: string]: ProvidersModel } = {}
    providers.map(e => mapping_provider[e.provider_id] = e)
    setProviderItems(providers)
    setProviderMap(mapping_provider)

    const genres_list = await genres(props.show_type);
    const mapping_genres: { [key: string]: Genres } = {}
    genres_list.map(e => mapping_genres[e.id] = e)
    setGenresItems(genres_list)
    setGenresMap(mapping_genres)
  }

  const save_region = async (element: RegionsModel) => {
    setValue("region", element.iso_3166_1)
    setSelectedProviders([])
    setSelectedRegion(element)
    setProviderItems(await get_providers(element.iso_3166_1, props.show_type))
  }

  const update_provider = async () => {
    if (selectedRegion?.iso_3166_1 == undefined) return
    setProviderItems(await get_providers(selectedRegion.iso_3166_1, props.show_type))
  }

  return (
    <View style={styles.container}>
      <View style={styles.dropdown_container}>
        <View style={styles.dropdown}>

          <Dropdown
            style={styles.dropdown_style}
            selectedTextStyle={styles.dropdown_placeholder}
            placeholderStyle={styles.dropdown_placeholder}
            iconStyle={styles.iconStyle}
            searchPlaceholder="Search..."
            value={selectedRegion}
            autoScroll={false}
            search
            placeholder='Select region'
            data={regionItems}
            labelField='english_name'
            valueField='iso_3166_1'
            onChange={save_region}
          />
        </View>

        <View style={styles.dropdown}>
          <MultiSelect
            style={styles.dropdown_style}
            iconStyle={styles.iconStyle}
            visibleSelectedItem={false}
            placeholderStyle={styles.dropdown_placeholder}
            labelField="provider_name"
            valueField="provider_id"
            placeholder='Select providers'
            onChange={setSelectedProviders}
            value={selectedProviders}
            data={providerItems} />
        </View>

        <View style={[styles.dropdown, {marginBottom:10}]}>
          <MultiSelect
            style={styles.dropdown_style}
            iconStyle={styles.iconStyle}
            visibleSelectedItem={false}
            placeholderStyle={styles.dropdown_placeholder}
            labelField="name"
            valueField="id"
            placeholder='Select genres'
            onChange={setSelectedGenres}
            value={selectedGenres}
            data={genresItems} />
        </View>

      </View>

      {selectedProviders?.length > 0 && 
        <ScrollView horizontal={true} style={styles.scroller}>
          {selectedProviders?.map((e, i) => <View key={i}>
            <View style={styles.providerView}>
              <View style={{ marginRight: 10 }}>
                <Image source={{ uri: base_url_342 + providerMap[e]?.logo_path }} style={{ height: 20, width: 20 }} />
              </View>
              <FontText>{providerMap[e]?.provider_name}</FontText>
            </View>
          </View>)}
        </ScrollView>
      }

      {selectedGenres?.length > 0 &&
        <ScrollView horizontal={true} style={styles.scroller}>
          {selectedGenres?.map((e, i) => <View key={i}>
            <View style={styles.providerView}>
              <FontText>{genresMap[e]?.name}</FontText>
            </View>
          </View>)}
        </ScrollView>
      }
    </View>
  )
}

export default RegionsProvider


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    backgroundColor: Colors.background,
  },
  providerView: {
    borderColor: Colors.background_highlight,
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
    marginRight: 10,
    flexDirection: "row"
  },
  scroller: {
    marginBottom: 10,
  },
  dropdown_container: {
    alignItems: "center",

  },
  dropdown_style: {
    backgroundColor: Colors.darkLight,
    borderRadius: 5,
    height: 50,
  },
  dropdown_placeholder: {
    color: "white",
    marginLeft: 10
  },
  iconStyle: {
    marginRight: 10,
  },
  dropdown: {
    width: "100%",
    marginTop: 5
  },
})