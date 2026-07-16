
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  I18nManager,
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';
import CustomLabelInput from '../components/CustomLabelInput';
import CustomBtn from '../components/CustomBtn';
I18nManager.forceRTL(true); // تأكد من تفعيل RTL


export default function ChangePasswordScreen() {
  const { currentLocal } = useSelector((state) => state.Localization);
  const userinfo = useSelector((state) => state.authorization);
  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth >= 768; // أغلب التابلتات عرضها 768 أو أكبر
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureCurrent, setSecureCurrent] = useState(false);
  const [securePassword, setSecurePassword] = useState(false);
  const [secureConfirm, setSecureConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const convertArabicToEnglishNumbers = (text) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return text.replace(/[٠-٩]/g, (char) => englishNumbers[arabicNumbers.indexOf(char)]);
  };

  const handleVerify = async () => {
    console.log(userinfo?.userInfo?.type);
    
    if (!currentPassword) {
      Alert.alert(currentLocal.home.alertCurrentPasswordMissingMessage);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(currentLocal.home.alertPasswordMismatchMessage);
      return;
    }
        if(password.length < 8){
      Alert.alert("Error", currentLocal.home.password_length_error);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'https://nanosoft.technology/osta-basha/api/user/change-password',
        {
          current_password: currentPassword,
          new_password: password,
          new_password_confirmation: confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${userinfo?.token}` },
        }
      );

      Alert.alert(currentLocal.home.alertSuccessMessage);
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
      if(userinfo?.userInfo?.type === "client"){
        router.push("(tabs)");
      }else{
        router.push("(users)");
      }
        // router.push("(tabs)");
      }, 1500);
    } catch (error) {
      console.log(error.response?.data || error.message|| Object.values(error.response.data.errors)[0][0]);
      
      const message =  Object.values(error.response.data.errors)[0][0] || 'حدث خطأ أثناء تغيير كلمة المرور';
      Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        enableOnAndroid
        extraScrollHeight={Platform.OS === 'android' ? 100 : 0}
        keyboardOpeningTime={0}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom, flexGrow: 1 }}
      >
        <View style={styles.container}>


          <CommonHeader
            title={currentLocal.home.changePassword}
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
            <View>

              <View style={[styles.inputContainer, { flexDirection: "row" }]}>

                <CustomLabelInput
                  label={currentLocal.home.currentPasswordLabel}
                  value={currentPassword}
                  showPassword={secureCurrent}
                  setShowPassword={setSecureCurrent}
                  customShowPasswordComponent={<Ionicons name="eye" size={28} color="#666" />}
                  customHidePasswordComponent={<Ionicons name="eye-off" size={28} color="#666" />}
                  isPassword={true}
                  onChangeText={(text) => setCurrentPassword(convertArabicToEnglishNumbers(text))}
                  customWidth={isTablet ? screenWidth / 3 : screenWidth / 1.1}
                  customStyle={currentLocal.language === 'العربيه' ? {
                    flex: 1

                  } : {

                    flex: 1

                  }}
                />
              </View>
            </View>

            <View style={[styles.inputContainer, { flexDirection: "row" }]}>

              <CustomLabelInput
                label={currentLocal.home.newPasswordLabel}
                value={password}
                showPassword={securePassword}
                setShowPassword={setSecurePassword}
                isPassword={true}
                onChangeText={(text) => setPassword(convertArabicToEnglishNumbers(text))}
                customWidth={isTablet ? screenWidth / 3 : screenWidth / 1.1}
                customStyle={currentLocal.language === 'العربيه' ? {
                  flex: 1

                } : {

                  flex: 1

                }}
              />
            </View>




            <CustomLabelInput
              label={currentLocal.home.confirmPasswordLabel}
              value={confirmPassword}
              showPassword={secureConfirm}
              setShowPassword={setSecureConfirm}
              isPassword={true}
              onChangeText={(text) => setConfirmPassword(convertArabicToEnglishNumbers(text))}
              customWidth={isTablet ? screenWidth / 3 : screenWidth / 1.1}
              customStyle={currentLocal.language === 'العربيه' ? {
                flex: 1

              } : {

                flex: 1

              }}
            />


          </ScrollView>

          {/* buttonContaoiner */}
          <View style={styles.btnContainer}>
            <CustomBtn title={currentLocal.home.edit} onPressFun={handleVerify} loading={loading} disabled={loading} />
          </View>

        </View>

      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
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
  btnContainer: {
    margin: 12

  },
  btnText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'BoldMoto',
  },
  inputContainer: {
    marginBottom: 28,
  },

  btnDisabled: {
    backgroundColor: "#aaa",
  },
});
