import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field';
import { useDispatch, useSelector } from 'react-redux';
import CustomBtn from '../components/CustomBtn';
import { setuserInfo } from '../hooks/authorizationReducer';

const CELL_COUNT = 4;
const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768; // أغلب التابلتات عرضها 768 أو أكبر

const CodeScreen = () => {
        const { currentLocal } = useSelector((state) => state.Localization);
  const [value, setValue] = useState('')
  const [timer, setTimer] = useState(60)
  const { email } = useLocalSearchParams();
  
  const { countryCode } = useLocalSearchParams();
  const { state } = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
  const [countryCodeTitle, setCountryCodeTitle] = useState(null);

    const convertArabicToEnglishNumbers = (text) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return text.replace(/[٠-٩]/g, (char) => englishNumbers[arabicNumbers.indexOf(char)]);
  };
  const dispatch = useDispatch();
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT })
  const navigation = useNavigation()

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue
  })
// const getData=async()=>{
//   try {
//     const countryCodeTitle = await AsyncStorage.getItem("countryCodeTitle");

//     if (!email) {
//       return;
//     }

    
// setCountryCodeTitle(parsed?.nationalNumber)
//     if (!parsed) {
//       console.log("❌ رقم غير صالح");
//       return;
//     }
//   } catch (error) {
//     console.log("Error:", error);
//   }
// }
  useEffect(() => {
    if (timer === 0) return
console.log("test");

    
    
    const interval = setInterval(() => {
      setTimer(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const handlePress = async () => {
    // if(!value){
    // Alert.alert('برجاء ادخال الكود')
    // return;
    // }
if(state){
  setLoading(true)
    await axios
      .post(`https://nanosoft.technology/osta-basha/api/user/verify-forget-password`, {
        otp: value,
        email: email,
      })
      .then(async (res) => {
        setLoading(false)

           router.push({
            pathname: '/(routes)/SetNewPassword',
            params: { email: email },

          });

      })
      .catch((error) => {
          setLoading(false)

      console.log("message",error);




      });
    }else{
        setLoading(true)

          await axios
      .post(`https://nanosoft.technology/osta-basha/api/user/auth/verify`, {
        otp:value,
        email: email,
      },{
            headers: {
                        "Accept-Language": currentLocal.language == "العربيه" ? "ar" : "en"
                    }
      }
    )
      .then(async (res) => {
        setLoading(false)

        dispatch(setuserInfo({
          access_token: res.data.data.access_token,
          user: res.data.data.user,
        }));
        router.push("/(routes)/UserType")

      })
      .catch((error) => {
          setLoading(false)
      console.log("message");

Alert.alert(error.response.data?.message)



      });
    }
  }

  const resendCode = async() => {

        try {

      const response = await axios.post(
        'https://nanosoft.technology/osta-basha/api/user/forget-password',
        {

          "email": email
        }
      );
    setTimer(60)

    } catch (error) {
      console.log("message");
      
      const message = error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور';
      Alert.alert(message);
    } 
  }

  return (

  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View>
          <View>
            <TouchableOpacity style={{ width: 36, height: 36, borderWidth: 1, borderColor: "#e5e5e5", borderRadius: 18, justifyContent: "center", alignItems: "center" }} onPress={() => navigation.goBack()}>
              <Entypo name="chevron-small-left" size={28} color="black" />
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/logo-removebg-preview.png')}
                style={styles.image}
              />
            </View>

            <View style={styles.formContainer}>
              <Text allowFontScaling={false}style={currentLocal.language == 'العربيه' ?[styles.title,{textAlign:"right"}]:[styles.title,{textAlign:"left"}]}>{currentLocal.home.verifyaccount}</Text>
    
                <Text allowFontScaling={false}style={currentLocal.language == 'العربيه' ?[styles.subTitle,{textAlign:"right"}]:[styles.subTitle,{textAlign:"left"}]}>
                  {currentLocal.home.code_sent_to} {email}

              </Text>

              <CodeField
                ref={ref}
                {...props}
                value={value}
                                      onChangeText={(text) => setValue(convertArabicToEnglishNumbers(text))}

                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType='number-pad'
                textContentType='oneTimeCode'
                renderCell={({ index, symbol, isFocused }) => (
                  <Text allowFontScaling={false}
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}
                     
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />

              {timer > 0 ? (
                <Text allowFontScaling={false}style={styles.timerText}>
                    {currentLocal.home.resend_in} {`00:${timer < 10 ? '0' + timer : timer}`}

                </Text>
              ) : (
                <TouchableOpacity onPress={resendCode}>
                  <Text allowFontScaling={false}style={styles.resendText}> {currentLocal.home.resend_code}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>


        <View style={styles.btnContainer}>
          <CustomBtn title={currentLocal.home.verify} onPressFun={handlePress}disabled={loading} loading={loading} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default CodeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:isTablet?Dimensions.get('screen').height / 32: Dimensions.get('screen').height / 22,
    paddingBottom: Dimensions.get('screen').height / 15,
    paddingHorizontal: Dimensions.get('screen').width / 28,
    justifyContent: 'space-between'
  },
  image: {
    width:isTablet? Dimensions.get('screen').width /6: Dimensions.get('screen').width / 2.5,
    height:isTablet? Dimensions.get('screen').width / 6: Dimensions.get('screen').width / 2.5,
    alignSelf: 'center',
    resizeMode: 'contain',
    borderRadius:75 ,
   },

  title: {
    textAlign: 'right',
    fontSize: 16,
    fontFamily: 'BoldMoto',
    marginTop: 14
  },
  subTitle: {
    textAlign: 'right',
    fontSize: 16,
    fontFamily: 'MediumMoto',
    marginTop: 14
  },
  codeFieldRoot: { marginTop: 20, justifyContent: 'center' },
  cell: {
    width: 40,
    height: 50,
    lineHeight: 48,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#5112FF',
    textAlign: 'center',
    borderRadius: 8,
    marginHorizontal: 4
  },
  focusCell: {
    borderColor: '#5112FF'
  },
  timerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#555',
    fontFamily: 'RegulaMoto'
  },
  resendText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#5112FF',
    fontFamily: 'BoldMoto',
    textDecorationLine: 'underline'
  }
})
