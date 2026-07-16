import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/theme';
import { useSelector } from 'react-redux';

const Seemore = ({onPressFun}) => {
    const { currentLocal } = useSelector((state) => state.Localization);

  return (
            <TouchableOpacity onPress={onPressFun} style={styles.seeMoreContainer}>
              <Text allowFontScaling={false}  style={styles.seemoreText}>{currentLocal.home.seeMoreText}</Text>
            </TouchableOpacity>
  )
}

export default Seemore

const styles = StyleSheet.create({
  seeMoreContainer:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    marginBottom:22,
    paddingVertical:12,
    backgroundColor:Colors.light.tint,
            borderRadius:8,

  },
  seemoreText:{
            fontSize: 14,
        color:"#fff",
        fontFamily: "BoldMoto",

  }
})