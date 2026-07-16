import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const ProviderSubCategories = ({ dataItem ,onSelectSubCategory}) => {
  const { currentLocal } = useSelector((state) => state.Localization);
  const [subCategoryId, setSubCategoryId] = useState(null);
console.log(subCategoryId,"subCategoryId");

  return (
    <View style={styles.container}>

      <View style={{
        paddingHorizontal: Dimensions.get('screen').width / 28,
        paddingBottom: 12,
        //  flexDirection: currentLocal.language == 'العربيه' ? "row" : "row-reverse", justifyContent: "space-between"
      }}>
        <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}>{currentLocal.home.chooseSubCategoryPlaceholder}</Text>

        <View style={[styles.itemContainer,{
          justifyContent:"flex-end"
        }]}>
          {dataItem?.profile?.sub_categories?.map((item) => {
            return (
              <TouchableOpacity
                style={[
                  styles.expButton,
                  subCategoryId === item.id && styles.selectedExp,
                  
                ]}
                onPress={() => {
                  setSubCategoryId(item.id)
                  onSelectSubCategory(item.id);
                }}

              >
                <Text allowFontScaling={false} style={currentLocal?.language == "العربيه" ? styles.expText : [styles.expText, { fontSize: 12 }]}>{currentLocal?.language == "العربيه" ? item.title_ar : item.title_en}</Text>

              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default ProviderSubCategories

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    borderTopWidth: 5, borderTopColor: '#ddd',
    paddingTop: Dimensions.get('screen').height / 50,
  },
  title: {
    fontFamily: "BoldMoto",
    marginBottom: 7,
  },
  expText: {
    fontFamily: "SemiBoldMoto"
  },
  itemContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop:22
  },
  expButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 12,
    marginRight: 10,
    borderColor: '#ccc', marginBottom: 12

  },
  selectedExp: {
    backgroundColor: '#7D3CFF',
    borderColor: '#7D3CFF',
    color: '#fff',
    fontFamily: "SemiBoldMoto",
    marginBottom: 12
  },
})