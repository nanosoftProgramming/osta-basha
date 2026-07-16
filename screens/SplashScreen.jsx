// import { router } from 'expo-router';
// import { useEffect } from 'react';
// import { Dimensions, StyleSheet, View } from 'react-native';
// import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCountries } from '../hooks/Countries';
// const SplashScreen = () => {
//   const dispatch = useDispatch();
//   const translateX = useSharedValue(Dimensions.get('screen').width);
//   const locationInfo = useSelector((state) => state.location);
//   const userinfo = useSelector((state) => state.authorization);
//     const { loading: countriesLoading } = useSelector((state) => state.countries);
//   useEffect(() => {
//     dispatch(fetchCountries())

//   }, [dispatch])
//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ translateX: translateX.value }],
//     };
//   });
//   useEffect(() => {
//     const init = async () => {
//       translateX.value = withTiming(0, { duration: 1000 });
      
//       // setTimeout(() => {
//       //   if (locationInfo?.country_en) {
//       //     if (userinfo?.userInfo?.phone) {
//       //       if (userinfo?.userInfo?.type == "client") {
//       //         router.push('/(tabs)');
//       //       } else if (userinfo?.userInfo?.type == "service_provider") {

//       //         if (userinfo?.userInfo?.first_name) {
//       //           router.push('/(users)');

//       //         } else {
//       //           // router.push('/(routes)/Add');
//       //                           router.push({
//       //             pathname:'/(routes)/Add',
//       //               params: { from: 'Splash' }  

//       //           });


//       //         }
//       //       } else if (userinfo?.userInfo?.type == "shop_owner") {
//       //         if (userinfo?.userInfo?.first_name) {
//       //           router.push('/(users)');

//       //         } else {
//       //           // router.push('/(routes)/Add');
//       //                           router.push({
//       //             pathname:'/(routes)/Add',
//       //               params: { from: 'Splash' }  

//       //           });


//       //         }
//       //       } else {
//       //         router.push('/(routes)/UserType');
//       //       }
//       //     } else {
//       //       router.push('/(routes)/Login');

//       //     }

//       //   } else {
//       //     router.push('/(routes)/Countries');

//       //   }


//       // }, 2000);

//     }
//     init()
//   }, []);
//   return (
//     <View style={styles.logoContainer}>
//       <Animated.Image
//         source={require('../assets/images/logo-removebg-preview.png')}
//         style={[styles.image, animatedStyle]}
//       />
//     </View>
//   );
// }
// export default SplashScreen
// const styles = StyleSheet.create({
//   image: {
//     width: Dimensions.get('screen').width / 1,
//     height: Dimensions.get('screen').height / 2,
//     alignSelf: 'center',
//     resizeMode: 'contain',
//   },
//   logoContainer: {
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     flex: 1,
//   },
// });


// import { StyleSheet, Text, View } from 'react-native';
// import React, { useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const SplashScreen = () => {

//   const clearAll = async () => {
//     try {
//       await AsyncStorage.clear();
//       console.log('Storage cleared ✅');
//     } catch (e) {
//       console.log('Clear error:', e);
//     }
//   };

//   const getAllStorageData = async () => {
//     try {
//       const keys = await AsyncStorage.getAllKeys();

//       if (keys.length === 0) {
//         console.log('Storage is empty 📭');
//         return {};
//       }

//       const items = await AsyncStorage.multiGet(keys);

//       const result = {};
//       items.forEach(([key, value]) => {
//         try {
//           result[key] = JSON.parse(value);
//         } catch {
//           result[key] = value;
//         }
//       });

//       console.log('Storage data:', result);
//       return result;
//     } catch (error) {
//       console.log('Get error:', error);
//     }
//   };

//   useEffect(() => {
//     const init = async () => {

//       console.log('Before clear:');
//       await getAllStorageData();

//       await clearAll(); // ✅ clear storage

//       console.log('After clear:');
//       await getAllStorageData(); // should be empty

//     };

//     init();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text>SplashScreen</Text>
//     </View>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// });













import { router } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, View, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../hooks/Countries';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const translateX = useSharedValue(Dimensions.get('screen').width);

  const locationInfo = useSelector((state) => state.location);
  const userinfo = useSelector((state) => state.authorization);
  const { list: countries, loading: countriesLoading } = useSelector((state) => state.countries);
console.log(locationInfo?.callingCode_en,"locationInfo");

  // 🔹 fetch countries
  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

console.log(countries);

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 1000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // 🔥 wait for loading to finish
  useEffect(() => {
    console.log(countriesLoading,"countriesLoading");
    console.log(countries,"countries");

    
    if (!countriesLoading&&countries.length!=0) {
      setTimeout(() => {
          if (locationInfo?.callingCode_en) {
            if(userinfo?.userInfo?.phone){
            if (userinfo?.userInfo?.type === "client") {
              router.replace('/(tabs)');
            }else if (
              userinfo?.userInfo?.type === "service_provider" ||
              userinfo?.userInfo?.type === "shop_owner"
            ) {
              if (userinfo?.userInfo?.first_name) {
                router.replace('/(users)');
              } else {
                router.replace({
                  pathname: '/(routes)/Add',
                  params: { from: 'Splash' },
                });
              }
            } else {
              router.replace('/(routes)/UserType');
            }}else{
              // router.replace('/(routes)/Login');
                              router.replace({pathname:"/(routes)/Login",params:{previousScreen:"(routes)/Splash"}})

            }
          } else {
            router.replace('/(routes)/Countries');
          }
      }, 1000); 
    }else{
      console.log("dskflsk");
      
    }
  }, [countriesLoading]);

  return (
    <View style={styles.logoContainer}>
      
      <Animated.Image
        source={require('../assets/images/logo-removebg-preview.png')}
        style={[styles.image, animatedStyle]}
      />

      {/* 🔥 Loading Circle */}
      {countriesLoading && (
        <ActivityIndicator
          size="large"
          color="#000"
          style={{ marginTop: 20 }}
        />
      )}

    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height / 2,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  logoContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});