
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAds } from '../hooks/adsReducer';
import { unReadNotificationsCount } from '../hooks/notificationsReducer';
const { width, height } = Dimensions.get("window");

const HomeHeader = () => {
  const dispatch = useDispatch()
  const {list:ads} = useSelector((state) => state.adsReducer);
  const { unReadNotificationsCount: notificationsCount } = useSelector((state) => state?.notifications);
  const { currentLocal } = useSelector((state) => state.Localization);
  const userinfo = useSelector((state) => state.authorization);
console.log(ads);

  useEffect(() => {
    dispatch(fetchAds())
    dispatch(unReadNotificationsCount())

  }, [])
  return (
    <View style={styles.headerContainer}>
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: Dimensions.get('screen').height / 22,
        paddingHorizontal: Dimensions.get('screen').width / 28,
        marginBottom: Dimensions.get('screen').height / 75,
        position: "absolute",
        zIndex: 10000000,
        width: "100%",

      }}>
        <TouchableOpacity
          style={{
            marginTop: 5
          }}
          onPress={() => {
            if (userinfo?.token) {
              router.push("/(routes)/Notifications")
            } else {
              router.push({pathname:"/(routes)/Login",params:{previousScreen: userinfo?.userInfo?.type === "client" ?'(tabs)':('users'),}})
            }
          }}
        >
          {notificationsCount !== 0 &&
          userinfo?.token&&
            <View
              style={{
                backgroundColor: "red",
                borderRadius: 50,

                minWidth: 25,
                minHeight: 25,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                left: 18,
                bottom: 50,
                zIndex: 1000000
              }}
            >
              <Text allowFontScaling={false}
                style={{ color: "#fff", fontFamily: "BoldMoto", }}
              >{notificationsCount}</Text>

            </View>
          }
          <Ionicons name="notifications" size={32} color="white" />

        </TouchableOpacity>
        <Text></Text>

        <Image source={require('../assets/images/logo-removebg-preview.png')} style={{ width: 60, height: 75, }} />

      </View>
      <Carousel
        loop
        width={width}
        height={height * 0.3}
        autoPlay
        data={ads}
        scrollAnimationDuration={1000}
        autoPlayInterval={4000}
        renderItem={({ item }) => (
          <ImageBackground
            source={{ uri: currentLocal.language === "العربيه" ? item?.image_ar : item?.image_en }}
            style={styles.headerBg}
            resizeMode="contain"
          >
            <View style={styles.overlay}>

              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              </View>

              <View
                style={[
                  styles.buttonsRow,
                  { flexDirection: currentLocal.language === 'العربيه' ? 'row' : 'row-reverse' }
                ]}
              >
                <TouchableOpacity
                  style={styles.whiteBtn}
                  onPress={() =>
                    router.push("(routes)/AllAds")
                  }
                >
                  <Text allowFontScaling={false} style={[styles.subTitle, { color: "#000" }]}>{currentLocal.home.showAll}</Text>
                </TouchableOpacity>
              {item?.user_id&&

                <TouchableOpacity
                  style={styles.transparentBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/(routes)/UserDetails',
                      params: { marker: JSON.stringify(item?.user) },
                    })
                  }
                >
                  <Text allowFontScaling={false} style={styles.subTitle}>{currentLocal.home.showAd}</Text>
                </TouchableOpacity>
                              }

              </View>
            </View>
          </ImageBackground>


        )}
      />
    </View>
  )
}

export default HomeHeader

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: Dimensions.get('screen').height / 50,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

  },
  item: {
    width: "49%"
  },
  image: {
    resizeMode: "contain",
    width: "100%",
  },
  title: {
    color: "#fff",
    textAlign: "right",
    fontFamily: 'BoldMoto',
    marginBottom: 4

  },
  subTitle: {
    color: "#fff",
    textAlign: "right",
    fontFamily: 'MediumMoto',
    fontSize: 12


  },
  headerBg: {
    width: width,
    height: Dimensions.get("screen").height * 0.3,
  resizeMode:"contain",
  objectFit:"contain"
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // optional dark overlay
    paddingBottom: Dimensions.get('screen').height / 50,
    paddingHorizontal: Dimensions.get('screen').width / 28,

  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  subTitle: {
    color: "#fff",
    textAlign: "right",
    fontFamily: 'MediumMoto',
    fontSize: 12


  },
  buttonsRow: {
    alignItems: "center",
    marginBottom: 10,
  },

  whiteBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#fff",
    borderRadius: 6,
    marginHorizontal: 5,
  },

  transparentBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 6,
    marginHorizontal: 5,
  },



})