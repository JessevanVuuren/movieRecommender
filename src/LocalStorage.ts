import AsyncStorage from '@react-native-async-storage/async-storage';

export const setValue = async (tag:string, value:any) => {
  AsyncStorage.setItem(tag, JSON.stringify(value))
}

export const deleteValue = async (key:string) => {
  AsyncStorage.removeItem(key)
}

export const getValue = async (tag:string) => {
  const data = await AsyncStorage.getItem(tag)
  if (!data) return null
  return JSON.parse(data)
}

