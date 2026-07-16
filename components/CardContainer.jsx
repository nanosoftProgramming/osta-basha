
import { Colors } from '@/constants/theme';
import { fetchtoggleFavorit } from '@/hooks/wishList';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getDistance } from 'geolib';
import { useMemo } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../hooks/wishList';

const CardContainer = ({ item ,favState}) => {
  const dispatch = useDispatch();
  const {list:wishlist,loading:isLoading} = useSelector((state) => state.wishlist)
const isWishlisted = wishlist?.some((i) => i?.user?.id == item?.id);
  const { currentLocal } = useSelector((state) => state.Localization);
  const userinfo = useSelector((state) => state.authorization);
  const locationInfo = useSelector((state) => state.location);


  // ✅ التحقق من وجود الإحداثيات للمزود وللمستخدم الحالي
  const hasLocation = item?.lat && item?.long && locationInfo?.latitude && locationInfo?.longitude;

  const distanceInKm = useMemo(() => {
    if (!hasLocation) return 0; // إذا نقص أي إحداثي، نرجع 0

    try {
      const distanceInMeters = getDistance(
        { latitude: parseFloat(item.lat), longitude: parseFloat(item.long) },
        { latitude: parseFloat(locationInfo.latitude), longitude: parseFloat(locationInfo.longitude) }
      );
      return distanceInMeters / 1000;
    } catch (error) {
      console.log("Geolib Error:", error);
      return 0;
    }
  }, [item?.lat, item?.long, locationInfo]); console.log("Distance in KM:", distanceInKm.toFixed(2));

  const handleToggleWishlist =async() => {
    try {
    // Wait for the toggle to complete on the server
    await dispatch(fetchtoggleFavorit(item?.id)).unwrap();
    // Then refresh the list
    dispatch(fetchWishlist());
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
  }
    // dispatch(fetchtoggleFavorit(item?.id));
    //     dispatch(fetchWishlist())
    
  };
const isFavourite = favState ?? isWishlisted;

  return (
    <TouchableOpacity
      style={currentLocal.language == 'العربيه' ? [styles.container, { flexDirection: "row-reverse" }] : [styles.container, { flexDirection: "row" }]}
      onPress={() => router.push({
        pathname: '/(routes)/UserDetails', params: { marker: JSON.stringify(item) },
      })}    >
      <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row" }}>
        <View>
          {item?.image ?
            <Image source={{ uri: item?.type !== "shop_owner" ? item?.image : item?.shop_images[0].image }} style={styles.image} />

            :
            <View style={[
              styles.image, {
                justifyContent: "center",
                alignItems: "center"
              }
            ]}>

              <FontAwesome name="user" size={75} color="gray" style={{ alignSelf: "center" }} />
            </View>

          }
        </View>
        <View style={{ marginLeft: 5 }}>
          <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.name, { textAlign: "right" }] : [styles.name, { textAlign: "left" }]}>
            {item?.first_name + " " + item?.last_name}</Text>
          <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.category, { textAlign: "right" }] : [styles.category, { textAlign: "left" }]}>
            ({currentLocal.language == 'العربيه' ? item?.profile?.sub_category?.title_ar : item?.profile?.sub_category?.title_en})  {currentLocal.language == 'العربيه' ? item?.profile?.sub_category?.category?.title_ar : item?.profile?.sub_category?.category?.title_en}</Text>

          <View style={currentLocal.language == 'العربيه' ? [styles.itemContainer, { flexDirection: "row-reverse" }] : [styles.itemContainer, { flexDirection: "row" }]}
          >
            <Text allowFontScaling={false} style={styles.totalRating}>({item?.rates_avg ? item?.rates_avg : 0})</Text>

            <Rating
              type='star'
              ratingCount={5}
              imageSize={18}
              style={styles.starRating}
              readonly={true}
              startingValue={item?.rates_avg ? item?.rates_avg : 0}
            />


          </View>
          {item?.type !== "shop_owner" &&
            <View style={styles.priceContainer}>

              <Text allowFontScaling={false} style={styles.price}>
                <Text allowFontScaling={false} style={styles.priceTitle}>{currentLocal.home.priceTitle}</Text>

                {currentLocal.home.priceFrom} {item?.profile?.price} {item?.currency}
              </Text>
            </View>
          }
          <View style={styles.priceContainer}>
            <Text allowFontScaling={false} style={styles.price}>
              <Text allowFontScaling={false} style={styles.priceTitle}>{currentLocal.home.distance}</Text>
              {hasLocation
                ? ` ${currentLocal.home.awayfromyou} ${distanceInKm.toFixed(2)} ${currentLocal.home?.km}`
                : ` ${currentLocal.home.unknownLocation || 'غير متوفر'}`
              }
            </Text>
          </View>
        </View>
      </View>
      {Object.keys(userinfo?.userInfo).length !== 0 &&

        <TouchableOpacity
          style={{ position: 'absolute', top: 10, right: currentLocal.language == 'العربيه' ? "88%" : "5%" }}
          onPress={handleToggleWishlist}
        >

          <Entypo name={isFavourite ? "heart" : "heart-outlined"} size={32} color={isWishlisted ? Colors.light.tint : Colors.light.tint} />

        </TouchableOpacity>
      }
    </TouchableOpacity>
  )

}

export default CardContainer

const styles = StyleSheet.create({
  container: {
    marginBottom: 7,
    borderColor: "#ededed",
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12
  },
  image: {
    borderRadius: 12,
    marginBottom: 7,
    width: 100,
    height: 110,
    marginStart: 5
  },
  name: {
    fontFamily: 'BoldMoto',
    fontSize: 12,
    textAlign: 'left',
    marginHorizontal: 7,
    marginTop: 12
  },
  category: {
    textAlign: 'left',
    fontSize: Math.min(Dimensions.get('window').width / 34, 16),
    fontFamily: 'MediumMoto',
    marginBottom: 5
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 5,
  },

  priceTitle: {
    textAlign: 'left',
    fontFamily: 'BoldMoto',
    fontSize: Math.min(Dimensions.get('window').width / 34, 16),

  },
  price: {
    textAlign: 'left',
    fontFamily: 'MediumMoto',
    flexWrap: 'wrap',
    flexShrink: 1,
    fontSize: Math.min(Dimensions.get('window').width / 34, 16),
  },
  totalRating: {
    fontFamily: 'MediumMoto',
    fontSize: 10,
    color: "#5C5F62"
  }
})
