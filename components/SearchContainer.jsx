import { Fontisto } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'

const SearchContainer = () => {
          const { currentLocal } = useSelector((state) => state.Localization);

  return (
    <TouchableOpacity style={currentLocal.language == 'العربيه' ?[styles.container,{flexDirection:"row-reverse"}]:[styles.container,{flexDirection:"row"}]}onPress={()=>router.push('/(routes)/Search')}>
        <Fontisto name="search" size={20} color="black" />
<Text allowFontScaling={false}style={styles.searchText}>{currentLocal.home.searchPlaceholder}</Text>
    </TouchableOpacity>
  )
}

export default SearchContainer

const styles = StyleSheet.create({
container:{
    marginHorizontal: Dimensions.get('screen').width / 28,
    marginBottom:28,
    borderColor:"#ededed",
    borderWidth:1,
    backgroundColor:"#fff",
    borderRadius:12,
    padding:12,
    flexDirection:"row",
    alignItems:"center"

},
searchText:{
    fontFamily: 'BoldMoto',
    fontSize:12,
    marginHorizontal:5
}
})