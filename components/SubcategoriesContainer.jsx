import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubCategories } from '../hooks/subCategoriesReducer';
import { filterData } from '../hooks/filterationReducer';
import { fetchUsers } from '../hooks/users';
import SkiltonContainer from './SkiltonContainer';
import { Colors } from '@/constants/theme';

const SubcategoriesContainer = ({id}) => {
    const dispatch = useDispatch();
      const { currentLocal } = useSelector((state) => state.Localization);
          const { filter } = useSelector((state) => state.filterReducer);
    const locationInfo = useSelector((state) => state.location);
    const { list: subCategoriesData ,loading:subCategoriesLoading} = useSelector((state) => state?.subCategories);
      const [subCategory_id, setSubCategory_id] = useState(null);
console.log(filter?.[0]?.subcategorry_id,"filter");

useEffect(() => {
    dispatch(fetchSubCategories(id))

}, [])
  const renderItem = ({ item }) => {


    return (
      <TouchableOpacity style={{ marginHorizontal: 7, justifyContent: "center", alignItems: "center" }}
        onPress={() => {
          dispatch(filterData({ subcategorry_id: item.id }));
          setSubCategory_id(item.id)
          const data = {
            page: 1,
            paginated: 2,
            // sub_category_id: item.id,
            country: locationInfo?.country_en,
                  category_id: id,
...(filter?.[0]?.subcategorry_id && { sub_category_id: filter[0].subcategorry_id }), 
...(filter?.[0]?.experience && { experience_years: filter[0].experience }), 
...(filter?.[0]?.price && { max_price: filter[0].price }), 

          }

          dispatch(fetchUsers(data));
        }}
        key={item?.id}
      >
      <View style={filter?.[0]?.subcategorry_id == item?.id ? styles.activeSbCategoryContainer : styles.subCategoryContainer}>
          <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 30 }} />
        </View>
        <Text allowFontScaling={false} style={currentLocal.language == "العربيه" ? styles.name : [styles.name, { fontSize: 11 }]}>{currentLocal.language == "العربيه" ? item.title_ar : item.title_en}</Text>

      </TouchableOpacity>

    )
  }
  const skweltonItems = [1, 2, 3, 4, 5].map((item) => (
    <View key={item} style={{ marginHorizontal: 7, justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#E0E0E0' }} />
      <View style={{ width: 60, height: 10, marginTop: 5, backgroundColor: '#E0E0E0', borderRadius: 5 }} />
    </View>
  ));
  return (
    
    <View>
      {subCategoriesLoading?
<SkiltonContainer
loading={subCategoriesLoading}
data={skweltonItems}
/>
:
          <FlatList
            data={subCategoriesData}
            renderItem={renderItem}
keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            inverted={currentLocal.language === "العربيه"}
            contentContainerStyle={{
              paddingVertical: 10,
              flexGrow: 1, // 👈 force FlatList to measure full width
              justifyContent: "flex-start",
            }}
          />

    }
    </View>
  )
}

export default SubcategoriesContainer

const styles = StyleSheet.create({
    subCategoryContainer: {
    borderWidth: 1,
    borderColor: "#ededed",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  activeSbCategoryContainer: {
    borderWidth: 2,
    borderColor: Colors?.light?.tint,
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
    name: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'BoldMoto',
  },
})