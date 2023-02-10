import { StyleSheet, Text, View } from "react-native";
import React, {  } from "react"

interface ViewerWrapperProps {
    banner?: string,
    title?: string,
    date?:string,
    deathDate?:string,
    score?:number,
    description?:string,
    children?:React.ReactNode
}

const ViewerWrapper: React.FC<ViewerWrapperProps> = props => {

  return (
    <View style={{backgroundColor:"green", height:100, width:100}}>
      {props.children}
    </View>
  )
}

export default ViewerWrapper


const styles = StyleSheet.create({
  container: {
    
  },
})