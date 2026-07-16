

import { Colors } from '@/constants/theme';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { CountryPicker } from "react-native-country-codes-picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';
import CustomInput from '../components/CustomInput';
import { setuserInfo } from '../hooks/authorizationReducer';
import { PixelRatio } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import parsePhoneNumber from 'libphonenumber-js';
import { router } from 'expo-router';
import apiUrl from '../constants/apiUrl';
import CustomBtn from '../components/CustomBtn';
import CustomLabelInput from '../components/CustomLabelInput';
import { translateAll } from '../constants/translationService';

const fontScale = PixelRatio.getFontScale();

const ProfileScreen = () => {
    const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  const userinfo = useSelector((state) => state.authorization);
  const { currentLocal } = useSelector((state) => state.Localization);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [countryCodeTitle, setCountryCodeTitle] = useState(null);
  console.log(userinfo?.userInfo,"userinfo?.userInfo?.whatsapp");
  
  const [formData, setFormData] = useState({
    first_name: userinfo?.userInfo?.first_name,
    last_name: userinfo?.userInfo?.last_name,
    email: userinfo?.userInfo?.email,
    whatsapp: userinfo?.userInfo?.whatsapp != "undefined" ? userinfo?.userInfo?.whatsapp : null,
    profile_image: userinfo?.userInfo?.image,


  });

  const convertArabicToEnglishNumbers = (text) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return text.replace(/[٠-٩]/g, (char) => englishNumbers[arabicNumbers.indexOf(char)]);
  };



  const handleInputChange = (key, value) => {
    const convertedValue = convertArabicToEnglishNumbers(value);
    setFormData((prev) => ({ ...prev, [key]: convertedValue }));
  };

  const handleImagePick = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const resized = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 500 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setFormData(prev => ({
        ...prev,
        [field]: { uri: resized.uri },
      }));
    }
  };



  const formFields = [
    { key: "first_name", placeholder: currentLocal.home.first_name, value: formData?.whatsapp },
    { key: "last_name", placeholder: currentLocal.home.last_name },
    { key: "email", placeholder: currentLocal.home.email },
    { key: "whatsapp", placeholder: currentLocal.home.whatsapp, inputType: "whatsapp", value: formData?.whatsapp },


  ];
  const renderItem = ({ item }) => {
    if (item?.inputType === "whatsapp") {
      return (
        <View style={{ marginBottom: 7 }}>
          <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.name, { textAlign: "right" }] : [styles.name, { textAlign: "left" }]}>{item?.placeholder}</Text>
                {/* <CustomLabelInput
                            label={currentLocal.home.phone_number}
                            value={formData?.whatsapp}
                            isPassword={false}
                            showPassword={true}
                            phoneState={true}
                            onChangeText={(text) => {
                              // التحويل يعتمد على لغة التطبيق الحالية
                              const formatted = convertArabicToEnglishNumbers(text, currentLocal.language);
                              handleInputChange(item.key, formatted);
                            }}
          
                            numberonly={true}
                          /> */}










                                {/* phoneinput */}
                                        <View style={styles.inputContainer}>
                          
                                          <CustomLabelInput
                                            label={currentLocal.home.phone_number}
                                            value={formData?.whatsapp}
                                            isPassword={false}
                                            showPassword={true}
                                            phoneState={true}
                                            onChangeText={async (text) => {
                              const formatted = convertArabicToEnglishNumbers(text, currentLocal.language);
                              handleInputChange(item.key, formatted);
                                            }}
                          
                                            numberonly={true}
                                          />
                          
                                        </View>
          {/* <View style={currentLocal.language === 'العربيه' ? [styles.phoneInputContainer, { flexDirection: "row-reverse" }] : [styles.phoneInputContainer, { flexDirection: "row" }]}>
            <TouchableOpacity onPress={() => setShow(true)}>
              <Text allowFontScaling={false} style={styles.codeText}>{countryCode}</Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TextInput
              style={currentLocal.language === 'العربيه' ? [styles.textInput, { textAlign: "right" }] : [styles.textInput, { textAlign: "left" }]}
              placeholder={currentLocal.home.phoneExamplePlaceholder}
              placeholderTextColor="#999"
              value={item?.value}
              onChangeText={(text) => handleInputChange(item.key, text)}
              keyboardType="phone-pad"
            />
          </View>
          <CountryPicker
            show={show}
            onBackdropPress={() => setShow(false)}
            lang={currentLocal.language === "العربيه" ? 'ar' : "en"}
            inputPlaceholder={currentLocal.home.countrySearchPlaceholder}
            pickerButtonOnPress={(item) => {
              setCountryCode(item.dial_code);
              setShow(false);
              setCountryCodeTitle(item?.code)

            }}
            style={{
              modal: { height: Dimensions.get('screen').height / 1.8 },
              textInput: { height: 60, borderRadius: 0 },
              countryButtonStyles: { height: 50 },
            }}
          /> */}
        </View>
      )
    } else {
      return (
        <View style={{ marginBottom: 7 }}>
          <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.name, { textAlign: "right" }] : [styles.name, { textAlign: "left" }]}>{item?.placeholder}</Text>
          <CustomInput
            placeholder={item.placeholder}
            placeholderTextColor="#999"
            value={formData[item.key]}
            onChangeText={(text) => handleInputChange(item.key, text)}
            multiline={item.multiline}
            showPassword={true}

          />
        </View>
      )
    }
  };

  const handleSubmit = async () => {


    setLoading(true);

    const formDataa = new FormData();
    formDataa.append("first_name", formData?.first_name);
    formDataa.append("last_name", formData?.last_name);
    if (formData?.email && formData?.email.trim() !== "") {
      formDataa.append("email", formData?.email);
    }

        const phoneRes = await translateAll("", "en", formData?.whatsapp);
    formDataa.append("whatsapp", phoneRes?.formattedNumber);
    // formDataa.append("whatsapp_country_code", countryCode);
    if (formData?.profile_image && formData?.profile_image.uri) {
      formDataa.append("image", {
        uri: formData?.profile_image.uri,
        type: formData?.profile_image.type || "image/jpeg",
        name: formData?.profile_image.name || "profile.jpg",
      });
    }





    try {
      const res = await axios.post(`${apiUrl}/user/update-profile`, formDataa, {
        headers: {
          Authorization: `Bearer ${userinfo.token}`,
          'Content-Type': 'multipart/form-data',
          "Accept-Language": currentLocal.language == "English" ? "en" : "ar"


        },
      });

      setLoading(false);

      dispatch(setuserInfo({
        user: res.data.data,
        access_token: userinfo.token

      }));

      Alert.alert(userinfo?.userInfo?.first_name ? currentLocal.home.editSuccessAlert : currentLocal.home.addedSuccessfully);


      setTimeout(() => {
        router.push("(tabs)"); // or router.replace("/home")
      }, 1500);
      // router.push("(tabs)")
    } catch (error) {
      setLoading(false)
      Alert.alert(Object.values(error.response.data.errors)[0][0]);

    }
  };
  return (
    <>
      <TouchableWithoutFeedback
      style={{
        backgroundColor:"#fff"
      }}
        onPress={() => {
          if (!show) Keyboard.dismiss(); // only dismiss if picker not open
        }}
      >
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          enableOnAndroid
          extraScrollHeight={Platform.OS === 'android' ? 100 : 0}
          keyboardOpeningTime={0}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            { paddingBottom: insets.bottom, flexGrow: 1,backgroundColor:"#fff" },
          ]}
        >
          
          <SafeAreaView style={styles.container}>
            <FlatList
              data={formFields}
              renderItem={renderItem}
              keyExtractor={(item) => item.key}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 15 }}
              ListHeaderComponent={
                <>
              <CommonHeader
          title={currentLocal.home.profile}
          filterState={false}
          currentLocal={currentLocal}
        />
                  <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={() => handleImagePick('profile_image')}
                  >
                    <Image
                      source={
                        formData.profile_image
                          ? {
                            uri: formData.profile_image.uri
                              ? formData.profile_image.uri
                              : formData.profile_image,
                          }
                          : require('../assets/images/Rectangle 5621.png')
                      }
                      style={styles.profileImage}
                    />
                    <View style={styles.cameraIcon}>
                      <Text allowFontScaling={false} style={styles.cameraText}>
                        📷
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              }
            />
            {/* buttonContaoiner */}
            <View style={styles.btnContainer}>
              <CustomBtn title={currentLocal.home.add} onPressFun={handleSubmit} loading={loading} disabled={loading} />
            </View>
          </SafeAreaView>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>

      <CountryPicker
        show={show}
        onBackdropPress={() => setShow(false)}
        lang={currentLocal.language === 'العربيه' ? 'ar' : 'en'}
        inputPlaceholder={currentLocal.home.countrySearchPlaceholder}
        pickerButtonOnPress={(item) => {
          setCountryCode(item.dial_code);
          setShow(false);
        }}
        style={{
          modal: { height: Dimensions.get('screen').height / 1.8 },
          textInput: { height: 60, borderRadius: 0 },
          countryButtonStyles: { height: 50 },
        }}
      />
    </>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,
  },
  btnContainer: {
margin:12
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  listContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  item: {
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: Colors.light.tint,
    marginEnd: 5
  },
  dropdown: {
    height: Dimensions.get('screen').height / 16,
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.tint,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  timeBox: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  timeText: {
    fontFamily: 'BoldMoto',
    fontSize: 14,
    color: '#333',
  },
  placeholderStyle: {
    fontSize: 12 / fontScale,
    fontFamily: 'BoldMoto',
    color: "#ddd"

  },
  selectedTextStyle: {
    fontSize: 12,
    fontFamily: 'BoldMoto',
  },
  title: {
    fontSize: 16,
    fontFamily: 'BoldMoto',
    marginTop: 14,
  },
  subTitle: {
    fontSize: 12,
    fontFamily: 'SemiBoldMoto',
    marginBottom: 32,
  },
  imageContainer: {
    alignSelf: "center",
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    padding: 5,
  },
  cameraText: {
    fontSize: 14,
    color: "#fff",
  },
  imagePicker: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    height: 100,
    justifyContent: "center"
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    height: "70%",

  },
  workImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  workImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },

  btnDisabled: {
    backgroundColor: "#aaa",
  },
  btnText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "BoldMoto",
  },
  name: {
    fontFamily: "BoldMoto",
    fontSize: 12,
    textAlign: "left",
    marginHorizontal: 7,
    marginTop: 12,
    marginBottom: 12
  },
  certificateImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginleft: 10,
  },
  input: {
    fontFamily: "MediumMoto",
    color: "#000000",
    textAlign: "left",
    borderWidth: 1,
    borderColor: Colors.light.tint,
    minHeight: Dimensions.get('screen').height / 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 13,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7B61FF',
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    fontSize: 13,
  },
  textInput: {
    flex: 1,
    textAlign: 'left',
    fontFamily: 'RegulaMoto',
    fontSize: 14 / fontScale,
    color: '#000',
    allowFontScaling: false
  },
  separator: {
    width: 1,
    height: '70%',
    backgroundColor: '#7B61FF',
    marginHorizontal: 10,
  },
  codeText: {
    fontSize: 14,
    color: '#000',
  },
  disableInput: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
    minHeight: Dimensions.get('screen').height / 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 13,
    marginHorizontal: 2,
    justifyContent: "center"

  },
  disableInputText: {
    fontFamily: "MediumMoto",
    color: "#999",
    textAlign: "left",

  },
  workingTimeCard: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    marginleft: 10,
    position: "relative",
    minWidth: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  workingTimeText: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    fontFamily: "MediumMoto",
  },
  closeButton: {
    position: "absolute",
    top: -5,
    left: -5,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
