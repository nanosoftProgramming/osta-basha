import { router } from 'expo-router';
import { Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CardContainer from './CardContainer';
import { useEffect } from 'react';
import { fetchUsers } from '../hooks/users';
import SkiltonContainer from './SkiltonContainer';
const ShopsOwners = ({ items ,loading}) => {
  const { currentLocal } = useSelector((state) => state.Localization);
const skeletonData = [1, 2, 3];
console.log(!loading,"loading!loading");
console.log(loading,"loading");

const renderSkeleton = () => (
    <View style={{ paddingHorizontal: 10 }}>
      <View style={{ width: Dimensions.get('window').width - 20, height: 20, borderRadius: 10, backgroundColor: '#E0E0E0' }} />
      {[1, 2].map((i) => (
        <View style={styles.card}>
          {/* Image placeholder */}

          <View style={{ width: Dimensions.get('window').width - 20, height: Dimensions.get('window').height / 6, marginTop: 5, backgroundColor: '#E0E0E0', borderRadius: 5 }} />

        </View>
      ))}
</View>
);
  return (
    <View style={styles.container}>
      {loading ? (
    <SkiltonContainer
    loading={loading}
    data={renderSkeleton()}
    />

      ) : (
<>
      <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", justifyContent: "space-between", marginTop: 32 }}>
        <Text allowFontScaling={false} style={styles.title}>{currentLocal.home.featuredShopsTitle}</Text>
        <TouchableOpacity

          onPress={() =>
            router.push({
              pathname: '/(routes)/ShopownerList',
              params: { state: 'shop-owner' ,
                items: JSON.stringify(items)


              },
            })
          }
        >
          <Text allowFontScaling={false} style={styles.seeMore}>{currentLocal.home.seeMoreText}</Text>

        </TouchableOpacity>

      </View>
      <FlatList
        data={items.filter((item) => item.type === "shop_owner").slice(0, 3)}
        keyExtractor={(item) => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 100 : 20 }}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <CardContainer item={item} />
          </View>
        )}
      />
</>
      )}
    </View>
  )
}

export default ShopsOwners

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Dimensions.get('screen').width / 28,


  },
  title: {
    textAlign: "right",
    fontFamily: "BoldMoto",
    fontSize: 16,
    marginBottom: 12
  },
  itemsContainer: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // flexWrap: "wrap",
    paddingHorizontal: 1

  },
  itemContainer: {
    // width: "49%",
  },
  seeMore: {
    fontFamily: "MediumMoto", textDecorationLine: "underline"

  }
})