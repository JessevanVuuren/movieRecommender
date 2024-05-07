import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { get_filter_results, get_providers, get_regions } from "../src/fetcher"
import { getValue, setValue } from '../src/LocalStorage'
import { ProvidersModel } from '../models/providers'
import React, { useEffect, useState } from "react"
import { RegionsModel } from "../models/regions"
import { StyleSheet, View } from "react-native"
import { getLocales } from 'expo-localization'
import Colors from "../src/style"
import { FontText } from './fontText';
import { TvShowModel } from '../models/tvshow';
import { ResponseModel } from '../models/response';
import { FilterOptions } from '../models/filter';


interface RegionsProviderProps {
  show_type: string
  filter_options: (filter_options:FilterOptions) => void
}


const RegionsProvider: React.FC<RegionsProviderProps> = props => {
  const [providerItems, setProviderItems] = useState<ProvidersModel[]>([])
  const [regionItems, setRegionItems] = useState<RegionsModel[]>([])

  const [selectedRegion, setSelectedRegion] = useState<RegionsModel>()
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  
  useEffect(() => { setup() }, [])

  useEffect(() => { update_provider() }, [props.show_type])

  useEffect(() => {
    if (selectedRegion?.iso_3166_1 == undefined) return
    console.log(selectedRegion.iso_3166_1)
    props.filter_options({ provider:selectedProviders, region:selectedRegion.iso_3166_1})
  }, [props.show_type, selectedProviders])

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

    setProviderItems(await get_providers(country_code, props.show_type))

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

            placeholderStyle={styles.dropdown_placeholder}
            labelField="provider_name"
            valueField="provider_id"
            placeholder='Select providers'
            onChange={setSelectedProviders}
            value={selectedProviders}
            data={providerItems} />
        </View>
      </View>
    </View>
  )
}

export default RegionsProvider


const styles = StyleSheet.create({
  container: {
    marginHorizontal:15,
    backgroundColor: Colors.background,
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