import { Colors } from '@/constants/theme'; // Ensure you have this Colors file in place
import axios from 'axios';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import {  useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Platform, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import CustomBtn from '../components/CustomBtn';
import { setuserInfo } from '../hooks/authorizationReducer';
import { locationData } from '../hooks/LoacationSettings';
const screenWidth = Dimensions.get('window').width;
const UserTypeScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.authorization);
  const { currentLocal } = useSelector((state) => state.Localization);
  const locationInfo = useSelector((state) => state.location);

  const [userState, setUserState] = useState(0);
  const [city, setCity] = useState(null);
  // const [city, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const items = [
    { id: 1, name: currentLocal.home.craftsman, image: require('../assets/images/Mask group (1).png') },
    { id: 2, name: currentLocal.home.client, image: require('../assets/images/userImage.png') },
    { id: 3, name: currentLocal.home.shop_owner, image: require('../assets/images/car.png') },

  ];
  const handleRefresh=()=>{
    console.log("123");
    
  }
  const getLocation = async () => {
    // 1. طلب الإذن بالوصول للموقع
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('تم رفض الإذن بالوصول للموقع');
      Alert.alert("خطأ", "يجب السماح بالوصول للموقع لعمل التطبيق");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    let response = await Location.reverseGeocodeAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude
    });
    dispatch(locationData({
      city: response[0]?.city || '',
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    }))
    setCity(response[0]?.city || '');
    setLocation(currentLocation);
  };




  const handlePress = async () => {
    // if (!locationInfo?.latitude || !locationInfo?.longitude) {
    //   Alert.alert(currentLocal.home.select_account_type)
    //   return;

    // }


    console.log({
      type: userState === 1 ? 'service_provider' : userState === 2 ? "client" : "shop_owner",
      city: city,
      country: locationInfo?.country_en,
      lat: locationInfo?.latitude,
      long: locationInfo?.longitude
    });
    if (!userState) {
      Alert.alert(currentLocal.home.select_account_type)
      return;
    }
    if (locationInfo?.latitude) {
      try {
        setLoading(true)
        await axios.post(`https://nanosoft.technology/osta-basha/api/user/auth/choose-user-type`, {
          type: userState === 1 ? 'service_provider' : userState === 2 ? "client" : "shop_owner",
          city: locationInfo?.city,
          country: locationInfo?.country_en || '',
          lat: locationInfo?.latitude,
          long: locationInfo?.longitude
        }, {
          headers: {
            Authorization: `Bearer ${userinfo.token}`,
            "Accept-Language": currentLocal.language == "العربيه" ? "ar" : "en"
          }
        })
          .then(res => {
            dispatch(setuserInfo({
              access_token: res.data.data.access_token,
              user: res.data.data.user,
            }));
            setLoading(false)

            if (userState === 2) {
              router.push("/(tabs)")

            } else {
              // router.push({
              //   pathname: "/(routes)/Add",
              //   params: {
              //     routeName: "userType"
              //   }
              // })
              router.push({
                pathname: '/(routes)/Add',
                params: { from: 'UserType' }

              });

            }

          })
          .catch(error => {
            setLoading(false);
            console.log(error);

            if (error.response) {

              Alert.alert(
                currentLocal.home.error || 'Error',
                error.response.data?.message ||
                error.response.data?.error ||
                'Something went wrong'
              );

            } else if (error.request) {
              Alert.alert(
                currentLocal.home.error || 'Error',
                'No response from server'
              );
            } else {
              Alert.alert(
                currentLocal.home.error || 'Error',
                error.message
              );
            }
          });


      } catch (error) {
        setLoading(false)

        Alert.alert(error)
      }
    } else {
      getLocation()
    }






  };
  const userTypesData = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => setUserState(item.id)}
        key={item.id}
      >
        <View style={userState === item.id ? styles.activeCard : styles.card}>
          <View style={{ width: "100%", backgroundColor: "#fff" }}>
            <Image source={item.image} style={styles.image} />
          </View>
          <Text allowFontScaling={false} style={userState === item.id ? styles.activeName : styles.name}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
  return (

    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logo-removebg-preview.png')} style={styles.image} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {
            paddingBottom: Platform.OS === "ios" ? 0 : 0,
            flexGrow: 1,
          },
          styles.itemsContainer,
          currentLocal.language === 'العربيه' && styles.arItemsContainer
        ]}
        renderItem={userTypesData}
      refreshing={isLoading}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={handleRefresh}
                tintColor={"#fff"}
                colors={["#fff"]}
                progressViewOffset={25}
              />
            }

      />
      <View style={styles.btnContainer}>
        <CustomBtn title={currentLocal.home.next} onPressFun={handlePress} disabled={loading} loading={loading} />
      </View>
    </View>
  )
}

export default UserTypeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: Dimensions.get('screen').width / 28,
    justifyContent: "space-between"

  },

  scrollcontainer: {
    flexGrow: 1
  },
  image: {
    width: Dimensions.get('screen').width / 3,
    height: Dimensions.get('screen').height / 6,
    alignSelf: "center",
    resizeMode: "contain",
    borderRadius: 200, margin: 11
  },
  itemsContainer: {
    marginTop: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",

  },
  arItemsContainer: {
    flexDirection: "row-reverse",
  },
  itemContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "#fff",
    width: "100%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    marginTop: 12,
    textAlign: "center",
    fontFamily: "BoldMoto",
  },
  activeCard: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: Colors.light.tint,
    width: "100%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  activeName: {
    marginTop: 12,
    textAlign: "center",
    fontFamily: "BoldMoto",
    color: "#fff",
  },
})