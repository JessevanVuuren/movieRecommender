import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import React, { useState, useEffect } from "react"

const LoaderAnimation = (props) => {

  return (
    <View>
    {props.showAnimation == 0 && (
      <View style={{ height: 500, zIndex: 100, marginTop: 100 }}>
         <ActivityIndicator size="large" color="#ffffff" animating={true} />
      </View>
    )}
    </View>


  );
}

export { LoaderAnimation }

const styles = StyleSheet.create({

});