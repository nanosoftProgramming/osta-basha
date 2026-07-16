import { filterData } from '@/hooks/filterationReducer';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import SkiltonContainer from './SkiltonContainer';

const Services = ({ items,loading }) => {
  const dispatch=useDispatch();
  const scrollRef = useRef();
  
    const { currentLocal } = useSelector((state) => state.Localization);

useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollToEnd({ animated: false });
  }
}, []);
  const renderItem = ({ item }) => 
 {
  return   (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        dispatch(filterData({ category_id: item.id }));

        router.push({
          pathname: "/(routes)/UsersList",
          params: {
            title:currentLocal.language=="English"?item?.title_en: item.title_ar,
            id: item.id,
            state: "categories",
          },
        });
      }}
style={[
          styles.touchableItem,
           { transform: [{ scaleX: -1 }] }
        ]}
            >
      <View style={styles.itemContainer}>
        {/* Check if SvgComponent exists, otherwise use Image */}
        {item.SvgComponent ? (
          <item.SvgComponent width={50} height={50} />
        ) : (
          <Image source={{ uri: item.image }} style={styles.image} />
        )}
      </View>
      <Text allowFontScaling={false}style={currentLocal?.language=="العربيه"?styles.name:[styles.name,{fontSize:12}]}>{currentLocal?.language=="العربيه"?item.title_ar:item.title_en}</Text>
    </TouchableOpacity>
  );
 }
  const skweltonItems = [1, 2, 3, 4, 5].map((item) => (
    <View key={item} style={{ marginHorizontal: 7, justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: 120, height: 120, borderRadius: 30, backgroundColor: '#E0E0E0' }} />
      <View style={{ width: 120, height: 10, marginTop: 5, backgroundColor: '#E0E0E0', borderRadius: 5 }} />
    </View>
  ));
  return (
    <View style={styles.container}>
      {loading ? (
<SkiltonContainer
loading={loading}
data={skweltonItems}

/>
) : (


          <FlatList
      data={items}
      renderItem={renderItem}
      inverted={currentLocal.language !== 'العربيه'}
      keyExtractor={(item) => item.id}
        style={currentLocal.language === 'العربيه' ? { transform: [{ scaleX: -1 }] }:{ transform: [{ scaleX: 1 }] }} 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: currentLocal.language == 'العربيه' ? 'row-reverse' : 'row',
        paddingVertical: 10,
      }}
      
    />
      )}

    </View>
  )
}

export default Services

const styles = StyleSheet.create({
  touchableItem:{
        justifyContent: 'center',
    alignItems: 'center',

  },
  container: {
    paddingHorizontal: Dimensions.get('screen').width / 28,
  },
  itemContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ededed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    
    
  },

  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
        borderRadius: 15,

  },

  name: {
    fontSize:14,
    // textAlign: 'center',
    fontFamily: 'BoldMoto', 
    width: "100%",

    textAlign:"center"
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
})