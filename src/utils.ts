import { getValue } from '../src/LocalStorage'
import { getLocales } from 'expo-localization'


export const get_region_form_local = async () => {
  const region = await getValue("region")
  if (region) return region
  else {
    const local_region = getLocales()[0].regionCode
    if (local_region != "") return local_region
    else return "US"
  }
}