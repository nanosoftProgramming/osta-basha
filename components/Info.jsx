import { Colors } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { getDistance } from 'geolib';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const Info = ({ dataItem }) => {
  const { currentLocal } = useSelector((state) => state.Localization);
  const locationInfo = useSelector((state) => state.location);

  const distanceInMeters = getDistance(
    { latitude: dataItem?.lat, longitude: dataItem?.long },
    { latitude: locationInfo?.latitude, longitude: locationInfo?.longitude }
  );

  const distanceInKm = distanceInMeters / 1000;

  console.log("Distance in KM:", distanceInKm.toFixed(2));

  if (dataItem?.type === "service_provider") {
    return (
      <View style={styles.container}>
        <View style={{
          borderBottomColor: "#ddd", borderBottomWidth: 5, paddingHorizontal: Dimensions.get('screen').width / 28,
          paddingBottom: 12
        }}>
          <View>
            <Text allowFontScaling={false} style={[styles.value, {
              fontFamily: "BoldMoto",
              textAlign: currentLocal.language == 'العربيه' ? "right" : "left"
            }]}>{dataItem?.first_name} {dataItem?.last_name}</Text>
            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.value, { textAlign: "right" }] : [styles.value, { textAlign: "left" }]}>{currentLocal.language == 'العربيه' ? dataItem?.profile?.sub_category?.category?.title_ar : dataItem?.profile?.sub_category?.category?.title_en} ({currentLocal.language == 'العربيه' ? dataItem?.profile?.sub_category?.title_ar : dataItem?.profile?.sub_category?.title_en})</Text>
            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.value, { textAlign: "right" }] : [styles.value, { textAlign: "left" }]}>{currentLocal.home.price_placeholder}:   {dataItem?.profile?.price} {dataItem?.currency}</Text>
            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.value, { textAlign: "right" }] : [styles.value, { textAlign: "left" }]}>{currentLocal.home.distance}: {currentLocal.home.awayfromyou}  {distanceInKm.toFixed(2)} {currentLocal.home?.km}</Text>

            {/* <Text allowFontScaling={false}style={styles.price}>
                <Text allowFontScaling={false}style={styles.priceTitle}>{currentLocal.home.distance}</Text>

                {currentLocal.home.awayfromyou} {distanceInKm.toFixed(2)} {currentLocal.home?.km}
              </Text> */}
          </View>
        </View>

        {/* <View style={{ paddingHorizontal: Dimensions.get('screen').width / 28, paddingBottom: 12, borderBottomColor: "#ddd", borderBottomWidth: 5, paddingVertical: 22 }}>
                    <Text allowFontScaling={false}style={currentLocal.language == 'العربيه' ?[styles.value,{textAlign:"right"}]:[styles.value,{textAlign:"left"}]}>{currentLocal.home.card_number_placeholder}: {dataItem?.profile?.card_number}</Text>
                    <Image source={{ uri: dataItem?.profile?.card_image }} style={{ width: Dimensions.get('window').width / 3, height: 75, resizeMode: "contain", marginTop: 12 ,alignSelf:currentLocal.language == 'العربيه' ?"flex-end":"flex-start"}} />

                </View> */}
        <View style={{ paddingHorizontal: Dimensions.get('screen').width / 28, paddingBottom: 12, borderBottomColor: "#ddd", borderBottomWidth: 5 }}>
          <View style={currentLocal.language == 'العربيه' ? [styles.itemContainer, { flexDirection: "row-reverse" }] : [styles.itemContainer, { flexDirection: "row" }]}>

            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}>{currentLocal.home.address_placeholder} : </Text>
            <Text allowFontScaling={false} style={styles.value}>{dataItem?.profile?.address} {dataItem?.city} {dataItem?.country}</Text>

          </View>
          <View style={currentLocal.language == 'العربيه' ? [styles.itemContainer, { flexDirection: "row-reverse" }] : [styles.itemContainer, { flexDirection: "row" }]}>

            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}> {currentLocal.home.experience_years_placeholder} :</Text>

            <Text allowFontScaling={false} style={styles.value}> {String(dataItem?.profile?.experience_years)} {currentLocal.home.years}</Text>

          </View>
          <View>
            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}>{currentLocal.home.workingHoursPlaceholder}</Text>
            <View style={currentLocal.language == 'العربيه' ? [styles.itemContainer, { flexDirection: "row-reverse" }] : [styles.itemContainer, { flexDirection: "row" }]}>

              {dataItem?.working_times.map((item) => {
                return (
                  <View style={styles.itembox}>
                    <Text allowFontScaling={false} style={[styles.value, { color: "#fff" }]}>{item.day} ({String(item.start_at).slice(0, 5)}-{String(item.end_at).slice(0, 5)})</Text>
                  </View>
                )
              })}
            </View>

          </View>


        </View>
        <View style={{ paddingHorizontal: Dimensions.get('screen').width / 28, paddingBottom: 12 }}>
          <View style={currentLocal.language == 'العربيه' ? [styles.itemContainer, { flexDirection: "row-reverse" }] : [styles.itemContainer, { flexDirection: "row" }]}>
            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}>{currentLocal.home.experience_description_placeholder} : </Text>

            <Text allowFontScaling={false} style={[styles.value,currentLocal.language == 'العربيه' ?styles.arText:styles.enText]}>{dataItem?.profile?.experience_description}   </Text>

          </View>
        </View>
      </View>
    )
  }
  if (dataItem?.type === "shop_owner") {
    return (
      <View style={styles.container}>
        <View style={{
          borderBottomColor: "#ddd", borderBottomWidth: 5, paddingHorizontal: Dimensions.get('screen').width / 28,
          paddingBottom: 12
        }}>
          <View>
            <Text allowFontScaling={false} style={[styles.value, {
              fontFamily: "BoldMoto",
              textAlign: currentLocal.language == 'العربيه' ? "right" : "left"

            }]}>{dataItem?.profile?.shop_name} {currentLocal.language === "English" ? "Shop" : "محل"} </Text>
            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.value, { textAlign: "right" }] : [styles.value, { textAlign: "left" }]}>
              {currentLocal.language == 'العربيه' ? dataItem?.profile?.sub_category?.category?.title_ar : dataItem?.profile?.sub_category?.category?.title_en} ({currentLocal.language == 'العربيه' ? dataItem?.profile?.sub_category?.title_ar : dataItem?.profile?.sub_category?.title_en})

            </Text>

          </View>
        </View>

        <View style={{ paddingHorizontal: Dimensions.get('screen').width / 28, paddingBottom: 12, borderBottomColor: "#ddd", borderBottomWidth: 5 }}>
          <View style={currentLocal.language == 'العربيه' ? [styles.itemContainer, { flexDirection: "row-reverse" }] : [styles.itemContainer, { flexDirection: "row" }]}>
            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}>{currentLocal.home.address_placeholder} : </Text>
            <Text allowFontScaling={false} style={styles.value}>{dataItem?.profile?.address} {dataItem?.city} {dataItem?.country}</Text>

          </View>
          <View style={currentLocal.language == 'العربيه' ? [styles.itemContainer, { flexDirection: "row-reverse" }] : [styles.itemContainer, { flexDirection: "row" }]}>
            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}> {currentLocal.home.experience_years_placeholder} :</Text>

            <Text allowFontScaling={false} style={styles.value}> {String(dataItem?.profile?.experience_years)} {currentLocal.home.years}</Text>

          </View>
          <View>
            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}>{currentLocal.home.workingHoursPlaceholder}</Text>
            <View style={currentLocal.language == 'العربيه' ? [styles.itemContainer, { flexDirection: "row-reverse" }] : [styles.itemContainer, { flexDirection: "row" }]}>

              {dataItem?.working_times.map((item) => {
                return (
                  <View style={styles.itembox}>
                    <Text allowFontScaling={false} style={[styles.value, { color: "#fff" }]}>{item.day} ({String(item.start_at).slice(0, 5)}-{String(item.end_at).slice(0, 5)})</Text>
                  </View>
                )
              })}
            </View>

          </View>


        </View>
        <View style={{ paddingHorizontal: Dimensions.get('screen').width / 28, paddingBottom: 12, borderBottomColor: "#ddd", borderBottomWidth: 5, paddingVertical: 22, flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row" }}>
          {dataItem?.image ?
            <Image source={{ uri: dataItem?.image }} style={{ width: 75, height: 75, borderRadius: 75, resizeMode: "contain" }} />
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
          <View>
            <Text allowFontScaling={false} style={[styles.value, {
              fontFamily: "BoldMoto",
            }]}>{dataItem?.first_name} {dataItem?.last_name}</Text>

            <Text allowFontScaling={false} style={[styles.value, {
            }]}>{dataItem?.email}</Text>


          </View>
        </View>
        <View style={{ paddingHorizontal: Dimensions.get('screen').width / 28, paddingBottom: 12 }}>
          <View style={currentLocal.language == 'العربيه' ? [styles.itemContainer, { flexDirection: "row-reverse" }] : [styles.itemContainer, { flexDirection: "row" }]}>

            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}>{currentLocal.home.experience_description_placeholder} : </Text>

            <Text allowFontScaling={false} style={styles.value}>{dataItem?.profile?.products_description}   </Text>

          </View>
        </View>
      </View>
    )
  }
  if (dataItem?.type === "client") {
    return (
      <View style={styles.container}>
        <View style={{
          paddingHorizontal: Dimensions.get('screen').width / 28,
          paddingBottom: 12, flexDirection: currentLocal.language == 'العربيه' ? "row" : "row-reverse", justifyContent: "space-between"
        }}>
          <View>
            <Text allowFontScaling={false} style={[styles.value, {
              fontFamily: "BoldMoto",
            }]}>{dataItem?.first_name} {dataItem?.last_name}</Text>

          </View>
        </View>
        <View style={currentLocal.language == 'العربيه' ? [styles.itemContainer, { flexDirection: "row-reverse" }] : [styles.itemContainer, { flexDirection: "row" }]}>
          <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}>{currentLocal.home.address_placeholder} : </Text>
          <Text allowFontScaling={false} style={styles.value}>{dataItem?.city} {dataItem?.country}</Text>

        </View>
        <View style={currentLocal.language == 'العربيه' ? [styles.itemContainer, { flexDirection: "row-reverse" }] : [styles.itemContainer, { flexDirection: "row" }]}>
          <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}> {currentLocal.home.email} : </Text>
          <Text allowFontScaling={false} style={styles.value}>{dataItem?.email}</Text>

        </View>

      </View>
    )
  }

}

export default Info

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    // paddingHorizontal: Dimensions.get('screen').width / 28,

  },
  arText:{
textAlign:"right"
  },
  enText:{
textAlign:"left"
  },
  text: {
    marginBottom: 7,
    textAlign: 'left',
    fontSize: 16,
    fontFamily: 'BoldMoto',
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap"
  },
  title: {
    fontFamily: "BoldMoto",
    marginTop: 7,

  },
  value: {
    fontFamily: "MediumMoto",
    marginHorizontal: 7,
    marginTop: 7
  },
  itembox: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 5,
    paddingVertical: 2,
    paddingBottom: 5,
    borderRadius: 8,
    marginTop: 7, marginHorizontal: 5
  }
})