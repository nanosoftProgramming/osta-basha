import { Colors } from '@/constants/theme';
import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    I18nManager,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { FloatingLabelInput } from "react-native-floating-label-input";
import { useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';
I18nManager.forceRTL(true); 

import { PixelRatio } from 'react-native';
    const fontScale = PixelRatio.getFontScale();

export default function SetNewPasswordScreen() {
  const { currentLocal } = useSelector((state) => state.Localization);
  const userinfo = useSelector((state) => state.authorization);
  const token = userinfo.token;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(false);
  const [secureConfirm, setSecureConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { email } = useLocalSearchParams();
  const { countryCode } = useLocalSearchParams();

  const convertArabicToEnglishNumbers = (text) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return text.replace(/[٠-٩]/g, (char) => englishNumbers[arabicNumbers.indexOf(char)]);
  };

  const handleVerify = async () => {


    if (password !== confirmPassword) {
      Alert.alert( currentLocal.home.alertPasswordMismatchMessage);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'https://nanosoft.technology/osta-basha/api/user/new-password',
        {
          password: password,
email:email
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Alert.alert(currentLocal.home.alertSuccessMessage);
      setPassword('');
      setConfirmPassword('');
      router.push({pathname:'/(routes)/Login',params:{previousScreen: '(routes)/SetNewPassword',}})

    } catch (error) {
      console.log(error);
      
      const message = error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور';
      Alert.alert( message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <CommonHeader
          title={currentLocal.home.shopOwner}
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

        <View style={{ marginTop: 22 }}>
  <TouchableOpacity onPress={() => setSecurePassword(!securePassword)}style={
    currentLocal.language === 'العربيه' ?
    {position:"absolute",left:"4%",top:"25%",zIndex: 100000000,}
  :
  
        {position:"absolute",right:"4%",top:"25%",zIndex: 100000000}

  
  }>
    {securePassword ? (
      <Entypo name="eye"  size={28} color="#333" />
    ) : (
      <Entypo name="eye-with-line" size={28} color="#333" />
    )}
  </TouchableOpacity>
          <FloatingLabelInput
            label={currentLocal.home.newPasswordLabel}
            isPassword={false}
            secureTextEntry={!securePassword}
           labelProps={{
    allowFontScaling: false, // <-- disables scaling for label
  }}
            value={password}
              onChangeText={(text) => setPassword(convertArabicToEnglishNumbers(text))}
          labelStyles={{
                    fontFamily: 'MediumMoto',
                    backgroundColor: 'white',
                    position: 'absolute',
                    allowFontScaling: false,
                    width: "auto",
                    [currentLocal.language === 'العربيه' ? 'right' : 'left']: 0,
                    top:  undefined,
                    textAlign: currentLocal.language === 'العربيه' ? 'right' : 'left'
                  }}
                                    customLabelStyles={{
          fontSizeFocused: 14,
          topFocused: -25,
          topBlurred: -5,
          allowFontScaling: false,

        }}
            containerStyles={styles.inputContainer}
            // inputStyles={styles.input}
                    inputStyles={{
                      textAlign: currentLocal.language === 'العربيه' ? 'right' : 'left',
                      fontFamily: 'MediumMoto',
                   allowFontScaling: false,
            fontSize: 16 / fontScale,
                      height:48,
                      paddingTop: 10,
                    }}
            // labelStyles={currentLocal.language === 'العربيه' ? styles.label : styles.enLabel}
            isRTL={true}
          />
        </View>
        <View style={{ marginTop: 22 }}>
          
  <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}style={
    currentLocal.language === 'العربيه' ?
    {position:"absolute",left:"4%",top:"25%",zIndex: 100000000,}
  :
  
        {position:"absolute",right:"4%",top:"25%",zIndex: 100000000}

  
  }>
    {secureConfirm ? (
      <Entypo name="eye"  size={28} color="#333" />
    ) : (
      <Entypo name="eye-with-line" size={28} color="#333" />
    )}
  </TouchableOpacity>

          <FloatingLabelInput
            label={currentLocal.home.confirmPasswordLabel}
            isPassword={false}
            secureTextEntry={ !secureConfirm}
          labelProps={{
    allowFontScaling: false, // <-- disables scaling for label
  }}
            value={confirmPassword}
                      onChangeText={(text) => setConfirmPassword(convertArabicToEnglishNumbers(text))}

            containerStyles={styles.inputContainer}
                inputStyles={{
                      textAlign: currentLocal.language === 'العربيه' ? 'right' : 'left',
                      fontFamily: 'MediumMoto',
                   allowFontScaling: false,
            fontSize: 16 / fontScale,
                      height:48,
                      paddingTop: 10,
                    }}            // labelStyles={currentLocal.language === 'العربيه' ? styles.label : styles.enLabel}
                 labelStyles={{
                    fontFamily: 'MediumMoto',
                    backgroundColor: 'white',
                    position: 'absolute',
                    allowFontScaling: false,
                    width: "auto",
                    [currentLocal.language === 'العربيه' ? 'right' : 'left']: 0,
                    top:  undefined,
                    textAlign: currentLocal.language === 'العربيه' ? 'right' : 'left'
                  }}
            isRTL={true}
                  customLabelStyles={{
          fontSizeFocused: 14,
          topFocused: -25,
          topBlurred: -5,
          allowFontScaling: false,

        }}
          />
        </View>



      </ScrollView>


      <TouchableOpacity
        style={[styles.btnContainer, loading && styles.btnDisabled]}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text allowFontScaling={false}style={styles.btnText}>
            {currentLocal.home.edit}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({



  label: {
    right: 10,
          fontSize: 10 / fontScale,
    paddingHorizontal: 4,
    fontFamily: "MediumMoto",
        textAlign:"right",
    width: "100%",
       allowFontScaling: false,


  },
  enLabel: {
    left: 10,
          fontSize: 10 / fontScale,
    paddingHorizontal: 4,
    top: 0,
    fontFamily: "MediumMoto",
    textAlign:"left",
    width: "100%",
       allowFontScaling: false,

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
  btnContainer: {
    backgroundColor: Colors.light.tint,
    height: Dimensions.get('screen').height / 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginVertical: 22,
    marginHorizontal: 22,
  },
  btnText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'BoldMoto',
  },
  inputContainer: {
    fontFamily: "MediumMoto",
    color: "#000000",
    borderWidth: 1,
    borderColor: Colors.light.tint,
    minHeight: Dimensions.get('screen').height / 16,
    paddingHorizontal: 12,
    borderRadius: 12,
          fontSize: 13 / fontScale,
    marginHorizontal: 2,
    height: 42,
  },
  input: {
    textAlign: "right",          fontSize: 13 / fontScale,
           allowFontScaling: false,




  },
  enInput: {
    textAlign: "left",
              fontSize: 13 / fontScale,
                     allowFontScaling: false,


  },
  icon: {
    position: 'absolute',
    zIndex: 1,
    top: 12,
    [I18nManager.isRTL ? 'right' : 'left']: 12,
  }
});
