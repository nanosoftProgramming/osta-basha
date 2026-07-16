
import * as ImageManipulator from 'expo-image-manipulator';
import { LinearGradient } from 'expo-linear-gradient';
import parsePhoneNumber from 'libphonenumber-js';
import { useEffect, useState } from 'react';

import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';


import { Colors } from '@/constants/theme';
import axios from 'axios';
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from 'expo-router';
import { Dropdown } from 'react-native-element-dropdown';
import WheelPickerExpo from "react-native-wheel-picker-expo";
import { useDispatch, useSelector } from 'react-redux';
import CustomLabelInput from '../components/CustomLabelInput';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonHeader from '../components/CommonHeader';

import { AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { PixelRatio } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomBtn from '../components/CustomBtn';
import { apiUrl } from '../constants/apiUrl';
import { setuserInfo } from '../hooks/authorizationReducer';
import { changeLocal } from '../hooks/Localization';
import { fetchSubCategories } from '../hooks/subCategoriesReducer';
import { fetchCategories } from '../hooks/categoriesReducer';
const fontScale = PixelRatio.getFontScale();
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
const AddScreen = () => {
  const { from } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const userinfo = useSelector((state) => state.authorization);
  const { currentLocal } = useSelector((state) => state.Localization);
  const locationInfo = useSelector((state) => state.location);
  const { list: categories, loading: categoriesLoading } = useSelector((state) => state?.categories);
  const { list: subCategoriesData } = useSelector((state) => state?.subCategories);

  const [selectedItems, setSelectedItems] = useState([]);
  const [toOpen, setTopOpen] = useState(false);
  const [fromOpen, setFromOpen] = useState(false);
  const dispatch = useDispatch()
  const Params = useLocalSearchParams();
  const [certificates, setCertificates] = useState([]);
  // const [categories, setCategories] = useState([]);
  const [shopImages, setShopImages] = useState([]);
  const [countryCode, setCountryCode] = useState('+966');
  const [fromhour, setFromHour] = useState('00');
  const [tohour, setToHour] = useState('00');
  const [toMinute, setToMinute] = useState('00');
  const [fromMinute, setFromMinute] = useState('00');
  const [toPeriod, setToPeriod] = useState();
  const [fromPeriod, setFromPeriod] = useState(currentLocal.home.am);
  const screenWidth = Dimensions.get('window').width;
  const [countryCodeTitle, setCountryCodeTitle] = useState(null);

  const isTablet = screenWidth >= 768; // أغلب التابلتات عرضها 768 أو أكبر

  const hours = Array.from({ length: 12 }, (_, i) => ({
    label: i?.toString().padStart(2, '0'),
    value: i?.toString().padStart(2, '0'),
  }));

  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: i?.toString().padStart(2, '0'),
    value: i?.toString().padStart(2, '0'),
  }));

  const periods = [
    { label: currentLocal.home.am, value: currentLocal.home.am },
    { label: currentLocal.home.pm, value: currentLocal.home.pm },
  ];
  console.log(categories,"categoriescategories");
  
  const catList = []
  categories.forEach(cat => {

    catList.push({
      label: `    ${currentLocal?.language == "العربيه" ? cat.title_ar : cat.title_en}`,
      value: cat?.id?.toString(),
    });
  });

  const initialIndex = periods.findIndex(
    (p) => p.value === currentLocal.home.am
  );

  const [loading, setLoading] = useState(false);
  const [workingTimes, setWorkingTimes] = useState([]);
  const [cities, setCities] = useState([]);

  const [show, setShow] = useState(false);
  const [dropdownData, setDropdownData] = useState([]);
  const [selectedLang, setSelectedLang] = useState(currentLocal?.language === "العربيه" ? "ar" : "en");
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    card_number: '',
    address: '',
    experience_years: '',
    experience_description: '',
    price: '',
    whatsapp: '',
    sub_category_id: '',
    category_id: '',
    currency_id: '',
    profile_image: '',
    id_image: '',

    city: userinfo?.userInfo?.city,
    country: userinfo?.userInfo?.country,
    lat: userinfo?.userInfo?.lat,
    long: userinfo?.userInfo?.long,
    profile_image: "",
    shop_name: "",
    type: userinfo?.userInfo?.type === "service_provider" ? { label: currentLocal.home.craftsman, id: "service_provider" } : { label: currentLocal.home.shop_owner, id: "shop_owner" },
    work_images: [],
  });
  const UserType = [
    { label: currentLocal.home.craftsman, id: "service_provider" },
    { label: currentLocal.home.shop_owner, id: "shop_owner" },

  ]
  console.log(userinfo);

  useEffect(() => {
    const getData = async () => {
    dispatch(fetchCategories())
      const { data: bigObject } = await axios.get(`https://iso3166-2-api.vercel.app/api/alpha/${locationInfo?.countryCode}`);

      const result = Object.keys(bigObject).map(code => {
        const gov = bigObject[code];

        // نفصل العربي/الإنجليزي من localOtherName
        const parts = gov.localOtherName.split(",").map(p => p.trim());

        const ar = parts.find(p => p.includes("(ara)"))?.replace("(ara)", "").trim();
        const en = parts.find(p => p.includes("(eng)"))?.replace("(eng)", "").trim();

        return {
          label: currentLocal.language === "English" ? en : ar,
          value: currentLocal.language === "English" ? en : ar,
        };
      });

      setCities(result);
      try {
        const jsonValue = await AsyncStorage.getItem('locationInfo');
        if (jsonValue != null) {
          const locationInfo = JSON.parse(jsonValue);
          setFormData(prev => ({
            ...prev,
            city: currentLocal.language == "العربيه" ? locationInfo.city_ar : locationInfo.city_en,      // أو city_ar حسب اللغة
            country: currentLocal.language == "العربيه" ? locationInfo.country_ar : locationInfo.country_en,
            lat: locationInfo.lat,
            long: locationInfo.long,
          }));
        } else {
        }
      } catch (e) {
        console.error('Error reading locationInfo:', e);
      }
      setToPeriod(currentLocal.home.am)
      setFromPeriod(currentLocal.home.am)
      const countryData = (await AsyncStorage.getItem('country'));

      // setCountryCode(res.data[0]?.idd?.root + res.data[0]?.idd?.suffixes[0]);
      const res = await axios.get(`https://restcountries.com/v3.1/name/${countryData}?fields=idd`);
      setCountryCode(res.data[0]?.idd?.root + res.data[0]?.idd?.suffixes[0]);

      if (Params?.selectedLat && Params?.selectedLng) {
        const latitude = Number(Params.selectedLat);
        const longitude = Number(Params.selectedLnfg);

        try {
          const [location] = await Location.reverseGeocodeAsync({ latitude, longitude });

          if (location) {
            const city = location.city || location.subregion;
            const country = location.country;

            setFormData((prev) => ({
              ...prev,

              lat: Params.selectedLat,
              long: Params.selectedLng,
              city: city,
              country: country
            }));


          }
        } catch (error) {
          console.error('Error during reverse geocoding:', error);
        }


      }


    };

    getData();
  }, [currentLocal.home.am]);





  const convertArabicToEnglishNumbers = (text) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return text.replace(/[٠-٩]/g, (char) => englishNumbers[arabicNumbers.indexOf(char)]);
  };
  const handleInputChange = (key, value) => {

    let newValue = value;

    if (key === 'whatsapp') {
      newValue = convertArabicToEnglishNumbers(value);
    }
    if (key == "experience_years") {
            newValue = convertArabicToEnglishNumbers(value);

    }
    if (key == "price") {
      newValue = convertArabicToEnglishNumbers(value);

    }
    if (key == "card_number") {
      newValue = value

    }

    setFormData((prev) => ({
      ...prev,
      [key]: newValue
    }));
  };

  const handleImagePick = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      // Resize the image (e.g., to 800px width while maintaining aspect ratio)
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

useEffect(() => {
  if (subCategoriesData?.length > 0) {
    const structuredList = subCategoriesData.map(sub => ({
      label:
        currentLocal.language == "العربيه"
          ? sub.title_ar
          : sub.title_en,
      value: sub.id?.toString(),
    }));

    setDropdownData(structuredList);
  }
}, [subCategoriesData, currentLocal.language]);
  const handleToggle = (item) => {
    // When checking for existence, now we check if the item's value is already in selectedItems (which will just be an array of values)
    const exists = selectedItems.includes(item.value); // Use .includes() for an array of simple values

    if (exists) {
      // If it exists, filter it out
      setSelectedItems((prev) => prev.filter((valueInArray) => valueInArray !== item.value));
    } else {
      // If it doesn't exist, add ONLY the item.value
      setSelectedItems((prev) => [...prev, item.value]);
    }

  };



  const data = [
    { label: currentLocal.home.Sunday, value: currentLocal.home.Sunday },
    { label: currentLocal.home.Monday, value: currentLocal.home.Monday },
    { label: currentLocal.home.Tuesday, value: currentLocal.home.Tuesday },
    { label: currentLocal.home.Wednesday, value: currentLocal.home.Wednesday },
    { label: currentLocal.home.Thursday, value: currentLocal.home.Thursday },
    { label: currentLocal.home.Friday, value: currentLocal.home.Friday },
    { label: currentLocal.home.Saturday, value: currentLocal.home.Saturday },
  ];
  const formFields = [
    // { key: "type", placeholder: currentLocal.home.first_name_placeholder, require: true },
    { key: "first_name", placeholder: currentLocal.home.first_name_placeholder, require: true },
    { key: "last_name", placeholder: currentLocal.home.last_name_placeholder, require: true },
    { key: "email", placeholder: currentLocal.home.email_placeholder, require: true },
    { key: "whatsapp", placeholder: currentLocal.home.whatsapp_placeholder, inputType: "whatsapp", require: true },
    { key: "experience_years", placeholder: currentLocal.home.experience_years_placeholder, require: true },
    { key: "country", placeholder: currentLocal.home.country_placeholder, statusKey: "disable" },
    { key: "city", placeholder: currentLocal.home.city_placeholder },
    // { key: "lat", placeholder:currentLocal.home.lat_placeholder, statusKey: "disable" },
    // { key: "long", placeholder: currentLocal.home.long_placeholder, statusKey: "disable" },
    { key: "address", placeholder: currentLocal.home.address_placeholder, require: true },
    { key: "categories", placeholder: currentLocal.home.subCategories_placeholder, require: true },
    { key: "subCategories", placeholder: currentLocal.home.subCategories_placeholder, require: true },
    // { key: "card_image", placeholder: currentLocal.home.card_image_placeholder, typeStatus: "id_image", require: true },

    ...(userinfo?.userInfo?.type === "service_provider"
      ? [
        { key: "price", placeholder: currentLocal.home.price_placeholder, require: true },
        { key: "experience_description", placeholder: currentLocal.home.providerexperience_description_placeholder, multiline: true, require: true },
        { key: "card_number", placeholder: currentLocal.home.card_number_placeholder, require: false },
        { key: "card_image", placeholder: currentLocal.home.card_image_placeholder, typeStatus: "id_image", require: true },
      ]
      : [
        { key: "shop_name", placeholder: currentLocal.home.shop_name_placeholder, require: true },
        { key: "experience_description", placeholder: currentLocal.home.experience_description_placeholder, multiline: true, require: true },

      ]),
  ];


  const renderItem = ({ item }) => {
    if (item?.key === "type") {
      return (
        <View style={{ marginBottom: 22 }}>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={[styles.placeholderStyle, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}
            selectedTextStyle={[styles.selectedTextStyle, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}
            itemTextStyle={{ fontFamily: 'BoldMoto' }}
            data={UserType}
            iconStyle={currentLocal.language == 'العربيه' ? { position: "absolute", left: 10 } : { position: "absolute", right: 10 }}
            labelField="label"
            valueField="value"
            search
            placeholder={currentLocal.home.chooseSubCategoryPlaceholder}
            value={formData.type}
            onChange={item => {
              setFormData(prev => ({
                ...prev,
                type: item.value,
              }));
            }}
            renderItem={(item, selected) => (
              <View style={{ padding: 10 }}>
                <Text
                  style={{
                    fontFamily: item.isCategory ? 'BoldMoto' : 'MediumMoto',
                    color: item.disabled ? '#ddd' : '#000',
                    textAlign: currentLocal.language == 'العربيه' ? "right" : "left"
                  }}
                  allowFontScaling={false} // ✅ مهم جداً

                >
                  {item.label}
                </Text>
              </View>
            )}
          />
        </View>
      )
    } else if (item?.key === "subCategories") {
      return (
        <View style={{ marginBottom: 22 }}>
          {/* <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", alignItems: "center" }}>
            <Text allowFontScaling={false}style={styles.name}>
              {item?.placeholder}</Text>
            {item?.require &&
              <Text allowFontScaling={false}style={{ fontSize: 18, color: "red" }}>*</Text>


            }

          </View> */}

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={[styles.placeholderStyle, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}
            selectedTextStyle={[styles.selectedTextStyle, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}
            itemTextStyle={{ fontFamily: 'BoldMoto' }}
            data={dropdownData}
            iconStyle={currentLocal.language == 'العربيه' ? { position: "absolute", left: 10 } : { position: "absolute", right: 10 }}
            labelField="label"
            valueField="value"
            placeholder={currentLocal.home.chooseSubCategoryPlaceholder}
            value={formData.sub_category_id}
            onChange={item => {
              if (!item.isCategory) {
                // Save the subcategory ID to your form state
                setFormData(prev => ({
                  ...prev,
                  sub_category_id: item.value,
                }));
              }
            }}
            renderItem={(item, selected) => (
              <View style={{ padding: 10 }}>
                <Text
                  style={{
                    fontFamily: item.isCategory ? 'BoldMoto' : 'MediumMoto',
                    color: item.disabled ? '#ddd' : '#000',
                    textAlign: currentLocal.language == 'العربيه' ? "right" : "left"
                  }}
                  allowFontScaling={false}
                >
                  {item.label}
                </Text>
              </View>
            )}
          />
        </View>
      )
    } else if (item?.key === "city") {
      return (
        <View style={{ marginBottom: 22 }}>
          {/* <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", alignItems: "center" }}>
            <Text allowFontScaling={false}style={styles.name}>
              {item?.placeholder}</Text>
            {item?.require &&
              <Text allowFontScaling={false}style={{ fontSize: 18, color: "red" }}>*</Text>


            }

          </View> */}

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={[styles.placeholderStyle, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}
            selectedTextStyle={[styles.selectedTextStyle, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}
            itemTextStyle={{ fontFamily: 'BoldMoto' }}
            data={cities}
            search
            iconStyle={currentLocal.language == 'العربيه' ? { position: "absolute", left: 10 } : { position: "absolute", right: 10 }}
            labelField="label"
            valueField="value"
            placeholder={currentLocal.home.city_placeholder}
            value={formData.city}
            onChange={item => {
              if (!item.isCategory) {
                setFormData(prev => ({
                  ...prev,
                  city: item.value,
                }));
              }
            }}
            renderItem={(item, selected) => (
              <View style={{ padding: 10 }}>
                <Text
                  style={{
                    fontFamily: item.isCategory ? 'BoldMoto' : 'MediumMoto',
                    color: item.disabled ? '#ddd' : '#000',
                    textAlign: currentLocal.language == 'العربيه' ? "right" : "left"
                  }}
                  allowFontScaling={false}
                >
                  {item.label}
                </Text>
              </View>
            )}
          />
        </View>
      )
    } else if (item?.key === "categories") {
      return (
        <View style={{ marginBottom: 22 }}>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={[styles.placeholderStyle, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}
            selectedTextStyle={[styles.selectedTextStyle, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}
            itemTextStyle={{ fontFamily: 'BoldMoto' }}
            iconStyle={currentLocal.language == 'العربيه' ? { position: "absolute", left: 10 } : { position: "absolute", right: 10 }}
            data={catList}
            labelField="label"
            valueField="value"
            placeholder={currentLocal.home.chooseCategoryPlaceholder}
            value={formData.category_id}
            onChange={async (item) => {

              setFormData({
                ...formData,
                category_id: item.value,
                 sub_category_id: null
              });
                  dispatch(fetchSubCategories(item.value))
              

                    }}
            renderItem={(item, selected) => (
              <View style={{ padding: 10 }}>
                <Text
                  style={{
                    fontFamily: item.isCategory ? 'BoldMoto' : 'MediumMoto',
                    color: item.disabled ? '#000' : '#000',
                    textAlign: currentLocal.language == 'العربيه' ? "right" : "left"
                  }}
                  allowFontScaling={false} // ✅ مهم جداً

                >
                  {item.label}
                </Text>
              </View>
            )}
          />
        </View>
      )
    } else if (item?.typeStatus === "id_image") {
      return (
        <View style={{ padding: 10, marginBottom: 20 }}>
          <View style={{ flexDirection: currentLocal.language === 'العربيه' ? "row" : "row-reverse", justifyContent: "flex-end", alignItems: "center" }}>
            <View style={{
              flexDirection: currentLocal.language === 'العربيه' ? "row" : "row-reverse",
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: 12,
            }}>
              <TouchableOpacity
                onPress={() => handleImagePick('id_image')}
                style={{ width: 150, height: 50 }} // تحديد حجم واضح
              >
                <LinearGradient
                  colors={['#0056b3', '#007bff', '#4C9CFF', '#A8D7FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={[styles.gradient, { flexDirection: currentLocal.language === 'العربيه' ? "row" : "row-reverse" }]}

                >
                  <AntDesign name="arrowup" size={20} color="white" />
                  <Text allowFontScaling={false} style={styles.buttonText}>{currentLocal.home.clickToUpload}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Text allowFontScaling={false} style={[{
              textAlign: currentLocal.language === 'العربيه' ? 'right' : 'left',
              fontSize: 14,
              fontWeight: 'bold',
              marginBottom: 8
            }, styles.name]}>
              {currentLocal.home.chooseIdImageText}
            </Text>
          </View>

          {formData.id_image && (
            <View style={{ position: "relative", width: "100%", height: 150, borderRadius: 10, overflow: "hidden" }}>
              <Image
                source={{ uri: formData.id_image.uri }}
                style={{ width: "100%", height: "100%", resizeMode: "contain" }}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 6,
                  [currentLocal.language === 'العربيه' ? "left" : "right"]: 6,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: 12,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
                onPress={() => setFormData({ ...formData, id_image: "" })}
              >
                <Text allowFontScaling={false} style={{ color: "white", fontWeight: "bold" }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

      )

    } else
      if (item?.statusKey == "disable") {
        return (
          <View style={{ marginBottom: 22 }}>
            <View style={styles.disableInput}>
              <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.disableInputText, { textAlign: "right" }] : [styles.disableInputText, { textAlign: "left" }]}>{formData[item.key]}</Text>
            </View>
          </View>
        )
      } else if (item?.inputType === "whatsapp") {
        return (
          <View style={{ marginBottom: 22 }}>

            <CustomLabelInput
              label={
                <Text allowFontScaling={false}>
                  {item?.placeholder}
                  {item?.require && <Text allowFontScaling={false} style={{ color: 'red' }}> *</Text>}
                </Text>
              }
              value={formData?.whatsapp}
              isPassword={false}
              showPassword={true}
              phoneState={true}
              onChangeText={(text) => handleInputChange(item.key, text)}

              numberonly={true}
            />
            {/* <TouchableOpacity onPress={() => setShow(true)} style={
                currentLocal.language === 'العربيه' ? {
                  borderColor: Colors.light.tint, borderWidth: 1,
                  paddingHorizontal: 15,
                  height: 50,
                  justifyContent: 'center',
                  borderBottomEndRadius: 12,
                  borderTopEndRadius: 12,


                } : {
                  borderColor: Colors.light.tint, borderWidth: 1,
                  paddingHorizontal: 15,
                  height: 50,
                  justifyContent: 'center',
                  borderBottomStartRadius: 12,
                  borderTopStartRadius: 12,

                }}>
                <Text allowFontScaling={false} style={styles.codeText}>{countryCode}</Text>
              </TouchableOpacity>

              <CustomLabelInput
                label={
                  <Text>
                    {item?.placeholder}
                    {item?.require && <Text allowFontScaling={false} style={{ color: 'red' }}> *</Text>}
                  </Text>
                }
                value={formData?.whatsapp}
                showPassword={true}
                onChangeText={(text) => handleInputChange(item.key, text)}
                customWidth={isTablet ? "86%" : "80%"}
                customStyle={currentLocal.language === 'العربيه' ? {
                  borderRightWidth: 0,
                  borderTopEndRadius: 0,
                  borderBottomEndRadius: 0,


                } : {
                  borderLeftWidth: 0,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 12,
                  borderTopRightRadius: 12

                }}
                numberonly={true}
              /> */}

          </View>
        )
      } else {
        return (
          <View style={{ marginBottom: 22 }}>

            <CustomLabelInput
              label={
                <Text allowFontScaling={false}>
                  {item?.placeholder}
                  {item?.require && <Text allowFontScaling={false} style={{ color: 'red' }}> *</Text>}
                </Text>
              }
              multiline={item?.multiline}

              value={formData[item.key]}
              onChangeText={(text) => handleInputChange(item.key, text)}
              customWidth={"100%"}
              showPassword={true}
              customStyle={currentLocal.language === 'العربيه' ? {
                flex: 1

              } : {

                flex: 1,

              }}
            />

          </View>
        )
      }
  };
  const handleAddValue = () => {
    if (selectedItems.length == 0) {
      Alert.alert(currentLocal.home.chooseDaysFirst)
    } else {
      const workingTimeApi = [];

      let finalFromHour = Number(fromhour);
      if (fromPeriod === currentLocal.home.pm) {
        if (finalFromHour !== 12) {
          finalFromHour += 12;
        }
      } else {
        if (finalFromHour === 12) {
          finalFromHour = 0;
        }
      }
      const formattedStartAt = `${String(finalFromHour).padStart(2, '0')}:${String(fromMinute).padStart(2, '0')}`;


      let finalToHour = Number(tohour);
      if (toPeriod === currentLocal.home.pm) {
        if (finalToHour !== 12) {
          finalToHour += 12;
        }
      } else {
        if (finalToHour === 12) {
          finalToHour = 0;
        }
      }
      const formattedEndAt = `${String(finalToHour).padStart(2, '0')}:${String(toMinute).padStart(2, '0')}`;


      workingTimeApi.push({
        day: selectedItems.join(','),
        start_at: formattedStartAt,
        end_at: formattedEndAt
      });
      setWorkingTimes(prevWorkingTimes => [...prevWorkingTimes, workingTimeApi]);

    }



  };

  const handleRemoveCertificate = (indexToRemove) => {
    if (userinfo?.userInfo?.type == "service_provider") {
      setCertificates((prev) => prev.filter((_, index) => index !== indexToRemove));
    } else {
      setShopImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    }

  };

  const handleRemoveWorkingTime = (indexToRemove) => {
    setWorkingTimes((prev) => prev.filter((_, index) => index !== indexToRemove));
  };
  const renderCertificates = () => (
    <>
      <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", alignItems: "center" }}>
        <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.name, { textAlign: "right" }] : [styles.name, { textAlign: "left" }]}>
          {currentLocal.home.certificatesText}
        </Text>
        <View style={{}}>


          <TouchableOpacity style={[styles.addButton, { backgroundColor: "transparent", alignItems: "flex-start", justifyContent: "flex-start", padding: 0 }]} onPress={pickCertificateImage}>
            <LinearGradient
              colors={['#0056b3', '#007bff', '#4C9CFF', '#A8D7FF']}
              locations={[0, 0.3, 0.7, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.gradient, { flexDirection: currentLocal.language === 'العربيه' ? "row" : "row-reverse" }]}
            >

              <AntDesign name="arrowup" size={24} color="white" style={styles.icon} />
              <Text allowFontScaling={false} style={styles.buttonText}>{currentLocal.home.clickToUpload}</Text>
            </LinearGradient>
            {/* <Text allowFontScaling={false}style={{ fontSize: 10, fontFamily: 'BoldMoto' ,color:"#fff"}}> {currentLocal.home.addNewImageText}</Text> */}
            {/* {formData.id_image ? (
            <Image
              source={{ uri: formData.id_image.uri }}
              style={styles.imagePreview}
            />) : (
            <Text allowFontScaling={false}style={{ fontFamily: "BoldMoto" }}>
              {currentLocal.home.chooseIdImageText}
            </Text>
          )} */}
          </TouchableOpacity>

        </View>

      </View>
      <FlatList
        data={certificates}
        horizontal
        keyExtractor={(item, index) => index?.toString()}
        renderItem={({ item, index }) => (
          <View style={{ marginEnd: 8 }}>
            <Image
              source={{ uri: item.uri || item.image }}
              style={styles.certificateImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleRemoveCertificate(index)}
            >
              <Text allowFontScaling={false} style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </>
  );
  const renderShopImages = () => (
    <View style={{}}>
      <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", alignItems: "center" }}>
        <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.name, { textAlign: "right", marginTop: 0 }] : [styles.name, { textAlign: "left", marginTop: 0 }]}>
          {currentLocal.home.shopImagesText}<Text allowFontScaling={false} style={{ fontSize: 18, color: "red" }}>*</Text>



        </Text>
        <View style={{}}>


          <TouchableOpacity style={[styles.addButton, { backgroundColor: "transparent", alignItems: "flex-start", justifyContent: "flex-start", padding: 0 }]} onPress={pickCertificateImage}>
            <LinearGradient
              colors={['#0056b3', '#007bff', '#4C9CFF', '#A8D7FF']}
              locations={[0, 0.3, 0.7, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[styles.gradient, { flexDirection: currentLocal.language === 'العربيه' ? "row" : "row-reverse" }]}
            >

              <AntDesign name="arrowup" size={24} color="white" style={styles.icon} />
              <Text allowFontScaling={false} style={styles.buttonText}>{currentLocal.home.clickToUpload}</Text>
            </LinearGradient>
            {/* <Text allowFontScaling={false}style={{ fontSize: 10, fontFamily: 'BoldMoto' ,color:"#fff"}}> {currentLocal.home.addNewImageText}</Text> */}
            {/* {formData.id_image ? (
            <Image
              source={{ uri: formData.id_image.uri }}
              style={styles.imagePreview}
            />) : (
            <Text allowFontScaling={false}style={{ fontFamily: "BoldMoto" }}>
              {currentLocal.home.chooseIdImageText}
            </Text>
          )} */}
          </TouchableOpacity>
        </View>

      </View>
      <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", marginBottom: 12 }}>
        {/* <TouchableOpacity onPress={pickCertificateImage} style={[styles.addButton, { backgroundColor: '#ddd' }]}>
          <Text allowFontScaling={false}style={[styles.btnText, { color: "#000", textAlign: "left", fontSize: 12 }]}>
            {currentLocal.home.addcertificatesText}

          </Text>
        </TouchableOpacity> */}


        <FlatList
          data={shopImages}
          horizontal
          keyExtractor={(item, index) => index?.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.certificateWrapper}>
              <Image
                source={{ uri: item.uri || item.image }}
                style={styles.certificateImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => handleRemoveCertificate(index)}
              >
                <Text allowFontScaling={false} style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      </View>
    </View>
  );


  const renderWorkingTimes = () => {
    return (
      <View style={{ marginHorizontal: 15, }}>
        <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.name, { textAlign: "right" }] : [styles.name, { textAlign: "left" }]}>{currentLocal.home.workingHoursText}
          <Text allowFontScaling={false} style={{ fontSize: 18, color: "red" }}>*</Text>
        </Text>
        <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", flexWrap: "wrap" }}>
          {data.map((item) => {
            const isSelected = (item) => {
              return selectedItems.includes(item.value);
            };
            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => handleToggle(item)}
                style={[
                  {
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    borderRadius: 25,
                    marginEnd: 12,
                    marginBottom: 8,
                    height: 50,
                    width: 90,
                    justifyContent: "center",
                    alignItems: "center"

                  },
                  {
                    borderColor: isSelected(item) ? Colors.light.tint : '#ddd',
                    backgroundColor: isSelected(item) ? Colors.light.tint : '#ddd',
                  },
                ]}
              >
                <Text allowFontScaling={false} style={[styles.name, { color: isSelected(item) ? '#fff' : '#000' }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={{ marginTop: 22, flexDirection: currentLocal.language == 'العربيه' ? "row" : "row-reverse", }}>

          <View style={{ width: '30%', }}>
            <Text allowFontScaling={false} style={[styles.timeText, { textAlign: "right" }]}>
            </Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddValue}>
              <Text allowFontScaling={false} style={{ color: '#fff', fontFamily: 'BoldMoto' }}> {currentLocal.home.save} </Text>
            </TouchableOpacity>




          </View>
          <View style={{ width: '35%', }}>
            <Text allowFontScaling={false} style={[styles.timeText, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}>
              {currentLocal.home.to}
            </Text>
            <View style={{ marginBottom: 12, width: "80%", marginTop: 12, alignSelf: currentLocal.language == 'العربيه' ? "flex-end" : "flex-start", }}>
              <TouchableOpacity onPress={() => setTopOpen(true)} style={currentLocal.language == 'العربيه' ? [styles.dropdown, styles.timeBox, { alignItems: "center", justifyContent: "center", height: Dimensions.get('screen').height / 14, }] : [styles.dropdown, { alignItems: "center", justifyContent: "center", height: Dimensions.get('screen').height / 14, }]}>
                <Text allowFontScaling={false} style={styles.timeText}>{tohour ? tohour + ":" + toMinute : currentLocal.home.to}</Text>
                <Text allowFontScaling={false} style={styles.timeText}>{toPeriod}</Text>

              </TouchableOpacity>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={toOpen}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setTopOpen(!toOpen);
              }}
              style={{ width: "100%" }}

            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>

                  <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", borderRadius: 22 }}>
                    <View style={{ fontSize: 28, }}>


                      <WheelPickerExpo
                        height={200}
                        width={75}
                        initialSelectedIndex={0}
                        items={minutes}
                        onChange={({ item }) => setToMinute(item.value)}
                        selectedStyle={{ borderWidth: 1, paddingVertical: 22 }}

                      />
                    </View>
                    <View style={{ fontSize: 28, }}>
                      <WheelPickerExpo
                        height={200}
                        width={75}
                        initialSelectedIndex={0}
                        items={hours}
                        onChange={({ item }) => setToHour(item.value)}
                        selectedStyle={{ borderWidth: 1, paddingVertical: 22 }}

                      />
                    </View>

                    <View style={{ fontSize: 28 }}>

                      <WheelPickerExpo
                        height={200}
                        width={75}
                        initialSelectedIndex={initialIndex >= 0 ? initialIndex : 0}
                        items={periods}
                        onChange={({ item }) => setToPeriod(item.value)}
                        selectedStyle={{ borderWidth: 1, paddingVertical: 22, fontFamily: 'BoldMoto' }}

                      />
                    </View>

                  </View>
                  <TouchableOpacity style={[styles.addButton, { flexDirection: "row", justifyContent: "center", marginTop: 12, width: "75%", alignSelf: "center" }]} onPress={() => setTopOpen(!toOpen)}>
                    <Text allowFontScaling={false} style={{ color: '#fff', fontFamily: 'BoldMoto', fontSize: 12 }}>{currentLocal.home.save}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>



          </View>
          <View style={{ width: '35%' }}>
            <Text allowFontScaling={false} style={[styles.timeText, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}>
              {currentLocal.home.from}
            </Text>
            <View style={{ marginBottom: 12, width: "80%", marginTop: 12, alignSelf: currentLocal.language == 'العربيه' ? "flex-end" : "flex-start" }}>
              <TouchableOpacity onPress={() => setFromOpen(true)} style={currentLocal.language == 'العربيه' ? [styles.dropdown, styles.timeBox, { alignItems: "center", height: Dimensions.get('screen').height / 14 }] : [styles.dropdown, styles.timeBox, { alignItems: "center", height: Dimensions.get('screen').height / 14, }]}>

                <Text allowFontScaling={false} style={styles.timeText}>{fromhour ? fromhour + ":" + fromMinute : currentLocal.home.from}</Text>
                <Text allowFontScaling={false} style={styles.timeText}>{fromPeriod}</Text>
              </TouchableOpacity>
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={fromOpen}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setFromOpen(!fromOpen);
              }}
              style={{ width: "95%" }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {/* <Pressable
                            style={{ alignItems: "flex-start" }}
                            onPress={() => setFromOpen(!fromOpen)}>
                            <Text allowFontScaling={false}style={styles.textStyle}>x</Text>
                          </Pressable> */}
                  <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", borderRadius: 22 }}>

                    <View >
                      <WheelPickerExpo
                        height={200}
                        width={75}
                        initialSelectedIndex={0}
                        items={minutes}
                        onChange={({ item }) => setFromMinute(item.value)}
                        selectedStyle={{ borderWidth: 1, paddingVertical: 22 }}


                      />
                    </View>
                    <View>
                      <WheelPickerExpo
                        height={200}
                        width={75}
                        initialSelectedIndex={0}
                        items={hours}
                        onChange={({ item }) => setFromHour(item.value)}
                        selectedStyle={{ borderWidth: 1, paddingVertical: 22, fontSize: 20 }}

                      />
                    </View>
                    <View>

                      <WheelPickerExpo
                        height={200}
                        width={75}
                        initialSelectedIndex={0}
                        items={periods}
                        onChange={({ item }) => setFromPeriod(item.value)}
                        selectedStyle={{ borderWidth: 1, paddingVertical: 22, fontFamily: 'BoldMoto' }}

                      />
                    </View>
                  </View>



                  <TouchableOpacity style={[styles.addButton, { flexDirection: "row", justifyContent: "center", marginTop: 12, width: "75%", alignSelf: "center" }]} onPress={() => setFromOpen(!fromOpen)}>
                    <Text allowFontScaling={false} style={{ color: '#fff', fontFamily: 'BoldMoto' }}>{currentLocal.home.save}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>




          </View>

        </View>
      </View>
    )
  };

  const pickCertificateImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = await Promise.all(
        result.assets.map(async (asset, index) => {
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: 500 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );

          return {
            uri: manipulatedImage.uri,
            type: 'image/jpeg',
            name: asset.fileName || `certificate_${Date.now()}_${index}.jpg`,
          };
        })
      );
      if (userinfo?.userInfo?.type === "service_provider") {
        setCertificates((prev) => [...prev, ...newImages]);

      } else {
        setShopImages((prev) => [...prev, ...newImages]);

      }
    }
  };

  const handleSubmit = async () => {
    const flatData = workingTimes.flat();

    setLoading(true);

    const formDataa = new FormData();
    formDataa.append("first_name", formData?.first_name);
    formDataa.append("last_name", formData?.last_name);
    if (formData?.email !== null) {
      formDataa.append("email", formData?.email);
    }
    formDataa.append("address", formData?.address);
    const xwhatsapp = parsePhoneNumber(formData?.whatsapp, locationInfo?.countryCode)


    formDataa.append("whatsapp", xwhatsapp?.nationalNumber);

    formDataa.append("experience_years", formData?.experience_years);
    formDataa.append("city", formData.city);

    flatData.forEach((item, index) => {

      formDataa.append(`working_times[${index}][day]`, item.day);
      formDataa.append(`working_times[${index}][start_at]`, item.start_at);
      formDataa.append(`working_times[${index}][end_at]`, item.end_at);
    });


    if (userinfo?.userInfo?.type === "service_provider") {
      formDataa.append("experience_description", formData?.experience_description);
      formDataa.append("price", formData?.price);
      // formDataa.append("unit", formData?.unit);
      if(formData?.card_number){
      formDataa.append("card_number", formData?.card_number);

      }
      if (formData?.id_image && formData?.id_image.uri) {
        formDataa.append("card_image", {
          uri: formData?.id_image.uri,
          type: formData?.id_image.type || "image/jpeg",
          name: formData?.id_image.name || "profile.jpg",
        });
      }


      certificates?.forEach((uri, index) => {

        formDataa.append(`certificates[${index}]`, {
          uri: uri?.uri,
          name: uri?.name || `certificates${index}.jpg`,

          type: uri?.type || 'image/jpeg',
        });
      });
    } else {
      formDataa.append("products_description", formData?.experience_description);
      formDataa.append("shop_name", formData?.shop_name);

      shopImages?.forEach((uri, index) => {

        formDataa.append(`shop_images[${index}]`, {
          uri: uri?.uri,
          name: uri?.name || `shop_images${index}.jpg`,

          type: uri?.type || 'image/jpeg',
        });
      });
    }
    formDataa.append("sub_category_id", formData?.sub_category_id);

    formDataa.append("whatsapp_country_code", countryCode);

    if (formData?.profile_image && formData?.profile_image.uri) {
      formDataa.append("image", {
        uri: formData?.profile_image.uri,
        type: formData?.profile_image.type || "image/jpeg",
        name: formData?.profile_image.name || "profile.jpg",
      });
    }

    try {
      const res = await axios.post(`https://nanosoft.technology/osta-basha/api/user/auth/complete-registration`, formDataa, {
        headers: {
          Authorization: `Bearer ${userinfo.token}`,
          'Content-Type': 'multipart/form-data',
          "Accept-Language": currentLocal.language == "العربيه" ? "ar" : "en"



        },
      });

      dispatch(setuserInfo({
        user: res.data.data,
        access_token: userinfo.token

      }));
      setLoading(false)

      router.push('/(users)')
    }catch (error) {
  setLoading(false);


  console.log("ERROR:", error);

  if (error?.response?.data?.errors) {
    const firstError = Object.values(error.response.data.errors)[0][0];
    Alert.alert(firstError);
  } else if (error?.response?.data?.message) {
    Alert.alert(error.response.data.message);
  } else {
    Alert.alert("Server error");
  }
}
  };
  console.log(formData.city,"formData.city");
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={formFields}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        ListFooterComponent={
          <>
            {userinfo?.userInfo?.type === "service_provider" ? (
              <>
                {renderCertificates()}
              </>
            )
              :

              (
                <>
                  {renderShopImages()}
                </>
              )
            }

            {renderWorkingTimes()}
            <FlatList
              data={workingTimes}
              horizontal
              keyExtractor={(item, index) => index?.toString()}
              contentContainerStyle={{ flexDirection: "row-reverse", paddingVertical: 12 }}

              renderItem={({ item, index }) => {

                return (
                  <View style={styles.workingTimeCard}>
                    <Text allowFontScaling={false} style={styles.workingTimeText}>
                      {item[0]?.day}</Text>
                    <Text allowFontScaling={false} style={styles.workingTimeText}>
                      {item[0]?.start_at} - {item[0]?.end_at}</Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => handleRemoveWorkingTime(index)}
                    >
                      <Text allowFontScaling={false} style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  
                )
              }}
            />

          </>
        }
        ListHeaderComponent={
          <>

{from!="Splash"?
                    <CommonHeader
          title={currentLocal.home.profile}
        filterState={false}
        
        currentLocal={currentLocal}

      />
      :
                          <CommonHeader
          title={currentLocal.home.add}
        filterState={false}
        
        currentLocal={currentLocal}

      />
}
              <TouchableOpacity style={styles.imageContainer} onPress={() => handleImagePick('profile_image')}>
                <Image
                  source={formData.profile_image ? { uri: formData.profile_image.uri } : require("../assets/images/Rectangle 5621.png")}
                  style={styles.profileImage}
                />
                <View style={styles.cameraIcon}>
                  <Text allowFontScaling={false} style={styles.cameraText}>📷</Text>
                </View>
              </TouchableOpacity>

        
            <View style={styles.itemContainer}>
              <TouchableOpacity onPress={() => {
                dispatch(changeLocal("en"));
                setSelectedLang('en')


              }}>
                <Image
                  source={require('../assets/images/emojione_flag-for-united-states.png')}
                  style={selectedLang === 'en' && styles.active}
                />
                <Text allowFontScaling={false} style={styles.itemText}>{currentLocal.home.english}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                dispatch(changeLocal("ar"));
                setSelectedLang('ar')

              }}>
                <Image
                  source={require('../assets/images/emojione_flag-for-saudi-arabia.png')}
                  style={selectedLang === 'ar' && styles.active}
                />
                <Text allowFontScaling={false} style={styles.itemText}>{currentLocal.home.arabic}</Text>
              </TouchableOpacity>
            </View>

          </>
        }

      />
      <View style={[styles.btnContainer, { marginBottom: insets.bottom+ 10, paddingTop: 12 }]}>  
                  <CustomBtn title={currentLocal.home.add} onPressFun={handleSubmit} loading={loading} disabled={loading} />
      </View>
      {/* <TouchableOpacity
        style={[styles.btnContainer, loading && styles.btnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text allowFontScaling={false} style={styles.btnText}>{currentLocal.home.add}</Text>
        )}
      </TouchableOpacity> */}


    </SafeAreaView>
  )
}

export default AddScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,
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
    fontSize: 12,
    color: '#333',
    allowFontScaling: false

  },
  placeholderStyle: {
    fontSize: 12 / fontScale,
    fontFamily: 'BoldMoto',
    allowFontScaling: false

  },
  selectedTextStyle: {
    fontSize: 12 / fontScale,
    fontFamily: 'BoldMoto',
    allowFontScaling: false
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
    borderRadius: 12,
    marginBottom: 7,
    width: 100,
    height: 110,
    marginStart: 5
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
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
    borderRadius: 8,
    height: "100%",
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: "center",
    marginTop: 8,
    height: Dimensions.get('screen').height / 14,

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
  btnContainer: {

    width: "100%",
    paddingHorizontal: 18
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
    textAlign: "right",
    marginHorizontal: 7,
    marginTop: 12,
    marginBottom: 12
  },
  certificateImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  input: {
    fontFamily: "MediumMoto",
    color: "#000000",
    textAlign: "right",
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
    textAlign: 'right',
    fontFamily: 'RegulaMoto',
    fontSize: 14,
    color: '#000',
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
    textAlign: "right",

  },
  workingTimeCard: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
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
    right: -5,
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
  buttonText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'BoldMoto',
    textTransform: 'uppercase',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginVertical: 22,
  },
  itemText: {
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'BoldMoto',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(0,0,0,0.8)"

  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    paddingVertical: 12,
    width: "75%",
    justifyContent: 'center',
    alignItems: 'center',


    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: 12
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#fff',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 22,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 22,
  },
  active: {
    borderWidth: 3,
    borderColor: Colors.light.tint,
    borderRadius: 50,
  },

});
