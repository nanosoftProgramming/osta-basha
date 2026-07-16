

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  I18nManager,
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import CustomLabelInput from '../components/CustomLabelInput';

import { Colors } from '@/constants/theme';
import axios from 'axios';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomBtn from '../components/CustomBtn';

I18nManager.forceRTL(true); // تأكد من تفعيل RTL
const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768; // أغلب التابلتات عرضها 768 أو أكبر
const fontScale = PixelRatio.getFontScale();


export default function ForgotPasswordScreen() {
  const { currentLocal } = useSelector((state) => state.Localization);
  const userinfo = useSelector((state) => state.authorization);
    const insets = useSafeAreaInsets();
  const token = userinfo.token;
  const [countryCode, setCountryCode] = useState('+966');
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);
  const [countryCodeTitle, setCountryCodeTitle] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getData = async () => {
      const code = await AsyncStorage.getItem('countryCode');
      const countryCodeTitle = await AsyncStorage.getItem('countryCodeTitle');

      setCountryCode(code);

      setCountryCodeTitle(countryCodeTitle)

    }
    getData()
  }, [])
  const convertArabicToEnglishNumbers = (text) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return text.replace(/[٠-٩]/g, (char) => englishNumbers[arabicNumbers.indexOf(char)]);
  };

  const handleVerify = async () => {





    try {
      setLoading(true);

      const response = await axios.post(
        'https://nanosoft.technology/osta-basha/api/user/forget-password',
        {

          "email": email
        }
      );
      router.push({
        pathname: '/(routes)/Code',
        params: { email:email, state: "forgetPassword" },

      });
    } catch (error) {
      const message = error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور';
      Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={[styles.container,{ paddingBottom: insets.top+10}]}>


                          <CommonHeader
          title={currentLocal.home.forgetPasswordText}
        filterState={false}
        currentLocal={currentLocal}

      />
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 22 }}>
        <View
          style={{

          }}
        >
          <Image source={require("../assets/images/changePassword.png")}
            style={{
              width: 200,
              height: 200,
              alignSelf: "center"
            }}
          />
        </View>
        {/* <Text allowFontScaling={false}style={[styles.label, { textAlign: currentLocal.language === 'العربيه' ? 'right' : 'left' }]}>
              {currentLocal.home.phone_number}
            </Text> */}

        {/* <TouchableOpacity onPress={() => setShow(true)} style={
              currentLocal.language === 'العربيه' ? {
                borderColor: Colors.dark.tint, borderWidth: 1,
                paddingHorizontal: 15,
                height: 50,
                justifyContent: 'center',
                borderBottomEndRadius: 12,
                borderTopEndRadius: 12,


              } : {
                borderColor: Colors.dark.tint, borderWidth: 1,
                paddingHorizontal: 15,
                height: 50,
                justifyContent: 'center',
                borderBottomStartRadius: 12,
                borderTopStartRadius: 12,

              }}>
              <Text allowFontScaling={false} style={styles.codeText}>{countryCode}</Text>
            </TouchableOpacity> */}

        <View style={styles.inputContainer}>
<CustomLabelInput
  label={currentLocal.home.email_placeholder}
  value={email}
  onChangeText={(text) => {
    setEmail(text);
  }}
  numberonly={false}
  showPassword={true}
  customWidth={"100%"}
  customStyle={{
    flex: 1
  }}
/>

        </View>







      </ScrollView>


      {/* btnContainer */}
      <View style={styles.btnContainer}>
        <CustomBtn title={currentLocal.home.verify} onPressFun={handleVerify} loading={loading} disabled={loading} />
      </View>

      {/* <TouchableOpacity
        style={[styles.btnContainer, loading && styles.btnDisabled]}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text allowFontScaling={false} style={styles.btnText}>
            {currentLocal.home.verify}
          </Text>
        )}
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({



  label: {
    right: 10,
    fontSize: 10,
    backgroundColor: "white",
    paddingHorizontal: 4,
    top: 0,
    fontFamily: "MediumMoto"

  },
  enLabel: {
    left: 10,
    fontSize: 10,
    backgroundColor: "white",
    paddingHorizontal: 4,
    top: 0,
    fontFamily: "MediumMoto"

  },


  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,
  },
  header: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "BoldMoto"
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontFamily: "MediumMoto"
  },

  helperText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 15,
    fontFamily: "MediumMoto"
  },

  btnText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'BoldMoto',
  },
  inputContainer: {
    marginBottom: 28,
  },
  input: {
    textAlign: "right",
  },
  enInput: {
    textAlign: "left",
  },
  icon: {
    position: 'absolute',
    zIndex: 1,
    top: 12,
    [I18nManager.isRTL ? 'right' : 'left']: 12,
  }
});
