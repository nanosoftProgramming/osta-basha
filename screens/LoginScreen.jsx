import { Colors } from '@/constants/theme';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import isValidPhoneNumber from 'libphonenumber-js';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import * as Location from 'expo-location';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import CustomBtn from '../components/CustomBtn';
import CustomLabelInput from '../components/CustomLabelInput';
import ChangeLanguageContainer from '../components/ChangeLanguageContainer';
import { registerForPushNotificationsAsync } from '../constants/NotificationService';
import { setuserInfo } from '../hooks/authorizationReducer';
import { translateAll } from '../constants/translationService';
import * as NavigationBar from 'expo-navigation-bar';
import { locationData } from '../hooks/LoacationSettings';
import CommonHeader from '../components/CommonHeader';
const LoginScreen = () => {
  const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();

  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const { currentLocal } = useSelector((state) => state.Localization);
  const locationInfo = useSelector((state) => state.location);
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [fcmToken, setFcmToken] = useState(null);

  const getLocation = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setErrorMsg('تم رفض الإذن بالوصول للموقع');
      Alert.alert("خطأ", "يجب السماح بالوصول للموقع لعمل التطبيق");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    console.log(currentLocation.coords, "cudadajdlkasjrrentLocation.coords.latitude");

    let response = await Location.reverseGeocodeAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude
    });

    dispatch(locationData({
      city: response?.[0]?.subregion || '',
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    }))

  };
  useEffect(() => {
    getLocation()
    registerForPushNotificationsAsync().then(token => {
      if (token) {

        setFcmToken(token);
      }
    });
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // لإخفاء الأزرار تماماً (تظهر عند السحب)
      NavigationBar.setVisibilityAsync("hidden");

      // أو لجعلها شفافة تماماً (أفضل لتجربة المستخدم)
      // NavigationBar.setBackgroundColorAsync("transparent");
      // NavigationBar.setBehaviorAsync('inset-touch');
    }
  }, []);
  const normalizeToEnglishNumbers = (text) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return text.replace(/[٠-٩]/g, (char) => englishNumbers[arabicNumbers.indexOf(char)]);
  };


  const handlePress = async () => {
if(locationInfo?.latitude==null || locationInfo?.longitude==null){
  Alert.alert("خطأ", "لا يمكن تسجيل الدخول بدون تفعيل الموقع");
  getLocation()
}else{
    const phoneRes = await translateAll("", "en", phoneNumber);
        if (!phoneNumber || !password) {
      Alert.alert("Error", currentLocal.home.fill_all_fields);
      return;
    }
    if(phoneRes?.formattedNumber.length < 9 || phoneRes?.formattedNumber.length > 15){
      Alert.alert("Error", currentLocal.home.invalid_phone_number);
      return;
    }
    if(password.length < 8){
      Alert.alert("Error", currentLocal.home.password_length_error);
      return;
    }







    setLoading(true)
    try {
      setLoading(true)
      const data = phoneRes?.formattedNumber == "0123456789" ? {
        password: password,
        phone: phoneRes?.formattedNumber,
        expo_token: fcmToken
      } : {
        password: password,
        phone: phoneRes?.formattedNumber,
        country_code: locationInfo?.callingCode_en,
        expo_token: fcmToken
      }




      const res = await axios.post(phoneRes?.formattedNumber == "123456789" ? `https://nanosoft.technology/osta-basha/api/admin/auth/login` : `https://nanosoft.technology/osta-basha/api/user/auth/login-or-register`, data);

      setLoading(false);
      if (res?.data?.data?.user?.role === "Super Admin") {
        dispatch(setuserInfo({
          token: res.data.data.access_token,
          user: res.data.data.user,
        }));
        router.push('/(admin)');

      } else {
        if (res.status === 200) {
          if (res.data.data !== null) {
            if (res.data.data.user.type === 'client') {
              dispatch(setuserInfo({
                access_token: res.data.data.access_token,
                user: res.data.data.user,
              }));
              router.push('/(tabs)');
            } else {
              dispatch(setuserInfo({
                access_token: res.data.data.access_token,
                user: res.data.data.user,
              }));

              if (res.data.data?.user?.first_name == null || res.data.data?.user?.first_name == '') {
                router.push({
                  pathname: '/(routes)/Add',
                  params: { from: 'Login' }

                });

              } else {
                router.push('/(users)');

              }

            }

          }
        } else if (res.status === 203) {

          dispatch(setuserInfo({
            access_token: res.data.data.access_token,
            user: res.data.data.user,
          }));
          router.push('/(routes)/UserType');

        } else if (res.status === 201) {
          Alert.alert(currentLocal.home.incorrect_password);
        }
      }


    } catch (error) {
      setLoading(false);
      console.log(error);

      if (error.response?.data) {

        const { message, errors } = error.response.data;
        const errorMessage = errors?.phone || message || "حدث خطأ أثناء المعالجة";

        Alert.alert("خطأ", errorMessage);
      } else {

      }
    }
  }

  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        enableOnAndroid={true}
        extraScrollHeight={120}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 10 }
        ]}
      >
                     <CommonHeader
          title={""}
          filterState={false}
          currentLocal={currentLocal}
          handleFunction={()=>router.push(params.previousScreen?params.previousScreen:"(routes)/Countries")}
          // handleFunction={()=>{console.log(params.previousScreen)
  
        />
        <View style={styles.container}>
    
          {/* logo container */}

          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/logo-removebg-preview.png')} style={styles.image} />
          </View>

          {/* chnageLang */}
          <>
            <ChangeLanguageContainer
              title={currentLocal.home?.choose_language}
            />
          </>

          {/* form */}
          <View style={styles.formContainer}>
            {/* phoneinput */}
            <View style={styles.inputContainer}>

              <CustomLabelInput
                label={currentLocal.home.phone_number}
                value={phoneNumber}
                isPassword={false}
                showPassword={true}
                phoneState={true}
                onChangeText={async (text) => {
                  // التحويل يعتمد على لغة التطبيق الحالية
                  const phoneRes = await translateAll("", currentLocal.language == "English" ? "en" : "ar", text);
                  setPhoneNumber(normalizeToEnglishNumbers(text))
                }}

                numberonly={true}
              />

            </View>
            {/* passwordInput */}
            <View style={styles.inputContainer}>
              <CustomLabelInput
                label={currentLocal.home.password}
                value={password}
                showPassword={passwordVisible}
                setShowPassword={setPasswordVisible}
                isPassword={true}
                numberonly={false}
                onChangeText={async (text) => {
                  setPassword(normalizeToEnglishNumbers(text))
                  // const passwordRes = await translateAll("", currentLocal.language == "English" ? "en" : "ar", text);
                  // setPassword(passwordRes?.formattedNumber)
                }}

              />



            </View>
            {/* forgetPassword  */}
            <View>
              <TouchableOpacity onPress={() => router.push('/(routes)/ForgotPassword')}>
                <Text allowFontScaling={false} style={[styles.forgetText, currentLocal.language == "English" && styles.enForgetText]}>{currentLocal.home.forgetPassword}</Text>
              </TouchableOpacity>

            </View>
            {/*  skip */}
            <View>
              <TouchableOpacity onPress={() => router.push('/(tabs)')}>
                <Text allowFontScaling={false} style={[styles.skipText, { marginTop: 22 }]}>{currentLocal.home.skip}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* btnContainer */}
          <View style={styles.btnContainer}>
            <CustomBtn title={currentLocal.home.log} onPressFun={handlePress} loading={loading} disabled={loading} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  Keybordcontainer: {
    flexGrow: 1
  },
  container: {
    backgroundColor: '#fff',
    paddingTop: Dimensions.get('screen').height / 50,
    paddingHorizontal: Dimensions.get('screen').width / 28,
    flexGrow: 1,
    justifyContent: "space-around"
  },

  image: {
    width: Dimensions.get('screen').width / 3,
    height: Dimensions.get('screen').height / 6,
    alignSelf: "center",
    resizeMode: "contain",

  },
  formContainer: {
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 28,
  },
  forgetText: {
    textAlign: 'left',
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: 'MediumMoto',
    marginTop: -20,
    textDecorationLine: "none",
    color: Colors.light.tint


  },
  enForgetText: {
    textAlign: "right"
  },
  skipText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: 'MediumMoto',

  }
})


