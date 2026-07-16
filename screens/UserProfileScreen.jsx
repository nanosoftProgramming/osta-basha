import { useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import ChooseCountry from '../components/ChooseCountry';
import CommonHeader from '../components/CommonHeader';
import CustomBtn from '../components/CustomBtn';
import CustomDropDown from '../components/CustomDropDown';
import CustomLabelInput from '../components/CustomLabelInput';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';import axios from 'axios';
import parsePhoneNumber from 'libphonenumber-js';
import WheelPickerExpo from 'react-native-wheel-picker-expo';
import apiUrl from '../constants/apiUrl';
import { Colors } from '../constants/theme';
import { setuserInfo } from '../hooks/authorizationReducer';
import { fetchSubCategories } from '../hooks/subCategoriesReducer';
import { router } from 'expo-router';
import { translateAll } from '../constants/translationService';
import { fetchCategories } from '../hooks/categoriesReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MultiSubCategories from '../components/MultiSubCategories';
import TabsContainer from '../components/TabsContainer';

const UserProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { currentLocal } = useSelector((state) => state.Localization);
  const { list: profile } = useSelector((state) => state.profile);
    const locationInfo = useSelector((state) => state.location);
  
  const  list = useSelector((state) => state.authorization);
  const { list: categories } = useSelector((state) => state?.categories);
  const { list: subCategories } = useSelector((state) => state?.subCategories);
  const [countryCode, setCountryCode] = useState(profile?.whatsapp_country_code);
  const [SelectedSubCategories, setSelectedSubCategories] = useState([]);
  const categoriesData = useMemo(() => {
    return categories?.map((item) => ({
      label: currentLocal?.language == "العربيه" ? item.title_ar : item.title_en,
      value: item?.id?.toString(),
    })) || [];
  }, [categories, currentLocal.language]);

  // تحويل الأقسام الفرعية لتناسب الـ Dropdown
  const subCategoriesData = useMemo(() => {
    return subCategories?.map((item) => ({
      label: currentLocal?.language == "العربيه" ? item.title_ar : item.title_en,
      value: item?.id?.toString(),
    })) || [];
  }, [subCategories, currentLocal.language]);

  // تجهيز البيانات الأولية (أزواج الأقسام) من البروفايل
  const initialPairs = useMemo(() => {
    const userSubCats = profile?.profile?.sub_categories || [];
    console.log(profile?.profile, "profile?.profile?.sub_categories");

    if (userSubCats.length > 0) {

      return userSubCats.map(sub => {

        return {
          categoryId: sub?.category_id?.toString(),
          subCategoryId: sub?.id?.toString(), 
           subCategories: [], // 👈 مهم

        };
      });
    }
    return [{ categoryId: "", subCategoryId: "" }];
  }, [profile]);



  const subCategoriesMap = useMemo(() => {
    const map = {};

    profile?.profile?.sub_categories?.forEach((sub) => {
      const catId = sub.category_id?.toString();

      if (!map[catId]) {
        map[catId] = [];
      }

      map[catId].push({
        label:
          currentLocal?.language === "العربيه"
            ? sub.title_ar
            : sub.title_en,
        value: sub.id.toString(),
      });
    });

    return map;
  }, [profile, currentLocal.language]);


  const convertArabicToEnglishNumbers = (text) => {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return text.replace(/[٠-٩]/g, (char) => englishNumbers[arabicNumbers.indexOf(char)]);
  };



  const [loading, setLoading] = useState(false);
  const [activeTabId, setActiveTabId] = useState("personal_info");
  const [oldCertificates, setOldCertificates] = useState(profile?.certificates || []);
  const [newCertificates, setNewCertificates] = useState([]);
  const [oldShopImages, setOldShopImages] = useState(profile?.shop_images || []);
  const [newShopImages, setNewShopImages] = useState([]);
console.log(profile, "profile?.certificates");
console.log(profile,"profileprofile");
  const [formData, setFormData] = useState({
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    email: profile?.email || null,
    card_number: profile?.profile?.card_number,
    city: profile?.city,
    address: profile?.profile?.address,
    experience_years: profile?.profile?.experience_years,
    experience_description: profile?.type === "service_provider" ? profile?.profile?.experience_description : profile?.profile?.products_description,
    price: profile?.profile?.price,
    whatsapp: profile?.whatsapp,
    profile_image: profile?.image,
    id_image: profile?.profile?.card_image,
    country: profile?.country,
    pairs: initialPairs, 
  });
  const [workingTimes, setWorkingTimes] = useState(profile?.working_times);
  const [newWorkingTimes, setNewWorkingTimes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [fromhour, setFromHour] = useState('00');
  const [tohour, setToHour] = useState('00');
  const [toMinute, setToMinute] = useState('00');
  const [fromMinute, setFromMinute] = useState('00');
  const [toOpen, setTopOpen] = useState(false);
  const [fromOpen, setFromOpen] = useState(false);
  const [toPeriod, setToPeriod] = useState(currentLocal.home.am);
  const [fromPeriod, setFromPeriod] = useState(currentLocal.home.am);
  const [cities, setCities] = useState([]);

  const hours = Array.from({ length: 12 }, (_, i) => ({
    label: i.toString().padStart(2, '0'),
    value: i.toString().padStart(2, '0'),
  }));

  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: i.toString().padStart(2, '0'),
    value: i.toString().padStart(2, '0'),
  }));

  const periods = [
    { label: currentLocal.home.am, value: currentLocal.home.am },
    { label: currentLocal.home.pm, value: currentLocal.home.pm },
  ];

  useEffect(() => {
    const getData = async () => {
      console.log(locationInfo?.countryCode,"locationInfo?.countryCode");
      
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
console.log(result,"result");

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

  const getSubCategoriesByCategory = (categoryId) => {
    return subCategoriesMap[categoryId] || [];
  };

  // const handlePairChange = (index, key, value) => {
  //   const updatedPairs = [...formData.pairs];
  //   updatedPairs[index][key] = value;

  //   if (key === 'categoryId') {
  //     updatedPairs[index].subCategoryId = ""; // تصفير الفرعي عند تغيير الرئيسي
  //     dispatch(fetchSubCategories(value));
  //   }

  //   setFormData({ ...formData, pairs: updatedPairs });
  // };


  const handlePairChange = async (index, key, value) => {
  const updatedPairs = [...formData.pairs];
  updatedPairs[index][key] = value;

  if (key === 'categoryId') {
    updatedPairs[index].subCategoryId = "";

    // 👇 هات subcategories الخاصة بالـ category دي
    const res = await dispatch(fetchSubCategories(value));

    updatedPairs[index].subCategories = res?.payload || [];
  }

  setFormData({ ...formData, pairs: updatedPairs });
};
  const handleInputChange = (key, value) => {
    let newValue = value;
    if (key === 'whatsapp') newValue = convertArabicToEnglishNumbers(value);
    if (key == "price") {
      newValue = convertArabicToEnglishNumbers(value);

    }
    if (key == "experience_years") {
      newValue = convertArabicToEnglishNumbers(value);

    }
    if (key === 'whatsapp') newValue = convertArabicToEnglishNumbers(value);
    setFormData((prev) => ({ ...prev, [key]: newValue }));
  };

  const formFields = [
    { key: "first_name", placeholder: currentLocal.home.first_name_placeholder },
    { key: "last_name", placeholder: currentLocal.home.last_name_placeholder },
    { key: "email", placeholder: currentLocal.home.email_placeholder },
    { key: "whatsapp", placeholder: currentLocal.home.whatsapp_placeholder, phoneState: true },
    { key: "dynamic_sections" }, // مفتاح خاص لتوليد أزواج الأقسام
    { key: "experience_years", placeholder: currentLocal.home.experience_years_placeholder },
    { key: "country", placeholder: currentLocal.home.country_placeholder, statusKey: "disable" },
    { key: "city", placeholder: currentLocal.home.city_placeholder, statusKey: "dropdown", data:cities }, // أضف بيانات المدن هنا
    { key: "address", placeholder: currentLocal.home.address_placeholder },
    ...(profile?.type === "service_provider" ? [
      { key: "price", placeholder: currentLocal.home.price_placeholder },
      { key: "experience_description", placeholder: currentLocal.home.providerexperience_description_placeholder, multiline: true },
      { key: "card_image", placeholder: currentLocal.home.card_image_placeholder, typeStatus: "id_image" },

      { key: "card_number", placeholder: currentLocal.home.card_number_placeholder },
    ] : [
      { key: "experience_description", placeholder: currentLocal.home.experience_description_placeholder, multiline: true },
    ]),
  ];
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

  // const handleAddValue = () => {
  //   if (workingTimes?.length !== 0) {
  //     Alert.alert(currentLocal.home.deleteTimes)
  //     return;
  //   } else {
  //     if (selectedItems?.length == 0) {
  //       Alert.alert(currentLocal.home.chooseDaysFirst)
  //     } else {
  //       const workingTimeApi = [];

  //       let finalFromHour = Number(fromhour);
  //       if (fromPeriod === currentLocal.home.pm) {
  //         if (finalFromHour !== 12) {
  //           finalFromHour += 12;
  //         }
  //       } else {
  //         if (finalFromHour === 12) {
  //           finalFromHour = 0;
  //         }
  //       }
  //       const formattedStartAt = `${String(finalFromHour).padStart(2, '0')}:${String(fromMinute).padStart(2, '0')}`;


  //       let finalToHour = Number(tohour);
  //       if (toPeriod === currentLocal.home.pm) {
  //         if (finalToHour !== 12) {
  //           finalToHour += 12;
  //         }
  //       } else {
  //         if (finalToHour === 12) {
  //           finalToHour = 0;
  //         }
  //       }
  //       const formattedEndAt = `${String(finalToHour).padStart(2, '0')}:${String(toMinute).padStart(2, '0')}`;


  //       workingTimeApi.push({
  //         day: selectedItems.join(','),
  //         start_at: formattedStartAt,
  //         end_at: formattedEndAt
  //       });
  //       setNewWorkingTimes(workingTimeApi);

  //     }

  //   }

  // };

  const handleAddValue = () => {
  if (workingTimes?.length !== 0) {
    Alert.alert(currentLocal.home.deleteTimes);
    return;
  }

  if (selectedItems?.length === 0) {
    Alert.alert(currentLocal.home.chooseDaysFirst);
    return;
  }

  // --- حساب وقت البداية ---
  let finalFromHour = Number(fromhour);
  if (fromPeriod === currentLocal.home.pm) {
    if (finalFromHour !== 12) finalFromHour += 12;
  } else {
    if (finalFromHour === 12) finalFromHour = 0;
  }
  const formattedStartAt = `${String(finalFromHour).padStart(2, '0')}:${String(fromMinute).padStart(2, '0')}`;

  // --- حساب وقت النهاية ---
  let finalToHour = Number(tohour);
  if (toPeriod === currentLocal.home.pm) {
    if (finalToHour !== 12) finalToHour += 12;
  } else {
    if (finalToHour === 12) finalToHour = 0;
  }
  const formattedEndAt = `${String(finalToHour).padStart(2, '0')}:${String(toMinute).padStart(2, '0')}`;

  // الكائن الجديد الذي سيتم إضافته
  const newEntry = {
    day: selectedItems.join(','),
    start_at: formattedStartAt,
    end_at: formattedEndAt
  };

  // التحديث بإضافة الجديد إلى القديم
  setNewWorkingTimes(prev => [...prev, newEntry]);

  // اختياري: تفريغ الاختيارات بعد الإضافة لتسهيل إضافة موعد جديد
  // setSelectedItems([]); 
};
const handleRemoveOldCertificate = async (indexToRemove, idToRemove) => {
  try {
    // التأكد من وجود التوكن (افترضنا أنه داخل profile حسب الـ selector لديك)
    const token = profile?.access_token || list?.token; 

    const res = await axios.post(`${apiUrl}/user/delete-image/${idToRemove}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`, // استخدام المتغير الصحيح
        "Accept-Language": currentLocal.language === "العربيه" ? "ar" : "en"
      },
    });

    // التأكد من أن الاستجابة تحتوي على بيانات قبل المعالجة
    if (res && res.data) {
      setOldCertificates((prev) => prev.filter((_, index) => index !== indexToRemove));
      
      dispatch(setuserInfo({
        user: res.data.data,
        access_token: token
      }));
    }
  } catch (error) {
    setLoading(false);
    // طباعة الخطأ في الكونسول لمعرفة السبب الحقيقي (شبكة، توكن، أو سيرفر)
    console.error("Error deleting image:", error.response?.data || error.message);
    Alert.alert("حدث خطأ أثناء حذف الصورة");
  }
};

  const handleRemoveNewCertificate = (indexToRemove) => {
    if (profile?.type === "service_provider") {
      setNewCertificates((prev) => prev.filter((_, index) => index !== indexToRemove));

    } else {
      setNewShopImages((prev) => prev.filter((_, index) => index !== indexToRemove));

    }
  };
  const formatNumberByLang = (price, lang) => {
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

    const str = String(price);

    if (lang === 'ar') {
      // convert English → Arabic
      return str.replace(/[0-9]/g, (digit) => arabicNumbers[digit]);
    } else {
      // convert Arabic → English
      return str.replace(/[٠-٩]/g, (digit) => englishNumbers[arabicNumbers.indexOf(digit)]);
    }
  };

  const handleRemoveWorkingTime = (indexToRemove) => {
    setWorkingTimes((prev) => prev.filter((_, index) => index !== indexToRemove));
  };
  const handleRemoveNewWorkingTime = (indexToRemove) => {

    setNewWorkingTimes((prev) => prev.filter((_, index) => index !== indexToRemove));
  };
  const renderCertificates = () => (
    <View style={{}}>
      <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.name, { textAlign: "right" }] : [styles.name, { textAlign: "left" }]}>
        {currentLocal.home.certificatesText}

      </Text>
      <View >
        <TouchableOpacity onPress={pickCertificateImage} style={styles.imagePicker}>
          <Text allowFontScaling={false} style={[styles.btnText, { color: "#000", textAlign: "left", fontSize: 12 }]}>
            {currentLocal.home.addcertificatesText}
          </Text>
        </TouchableOpacity>
      </View>

      {/* <FlatList
        data={certificates}
        horizontal
        keyExtractor={(item, index) => index.toString()}
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
              <Text allowFontScaling={false}style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
      /> */}
      <FlatList
        data={[...oldCertificates.map((item) => ({ ...item, isOld: true })), ...newCertificates.map((item) => ({ ...item, isOld: false }))]}
        horizontal
        keyExtractor={(item, index) => `${item.uri}_${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.certificateWrapper}>
            <Image
              source={{ uri: item.uri || item.image }}
              style={styles.certificateImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() =>
                item.isOld
                  ? handleRemoveOldCertificate(index, item.id)
                  : handleRemoveNewCertificate(index - oldCertificates?.length)
              }
            >
              <Text allowFontScaling={false} style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

    </View>
  );
  const renderShopImages = () => (
    <View style={{}}>
      <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.name, { textAlign: "right" }] : [styles.name, { textAlign: "left" }]}>  {currentLocal.home.shopImagesText}</Text>
      <View >
        <TouchableOpacity onPress={pickCertificateImage} style={styles.imagePicker}>
          <Text allowFontScaling={false} style={[styles.btnText, { color: "#000", textAlign: "left", fontSize: 12 }]}>
            {currentLocal.home.addNewImageText}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[...oldShopImages.map((item) => ({ ...item, isOld: true })), ...newShopImages.map((item) => ({ ...item, isOld: false }))]}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.certificateWrapper}>
            <Image
              source={{ uri: item.uri || item.image }}
              style={styles.certificateImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() =>
                item.isOld
                  ? handleRemoveOldCertificate(index, item.id)
                  : handleRemoveNewCertificate(index - oldShopImages?.length)
              }
            >
              <Text allowFontScaling={false} style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  ); const handleToggle = (item) => {
    const exists = selectedItems.includes(item.value); // Use .includes() for an array of simple values

    if (exists) {
      setSelectedItems((prev) => prev.filter((valueInArray) => valueInArray !== item.value));
    } else {
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

  const renderWorkingTimes = () => {
    return (
      <View style={{ marginHorizontal: 15, }}>
        <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.name, { textAlign: "right" }] : [styles.name, { textAlign: "left" }]}>{currentLocal.home.workingHoursText}</Text>
        <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", flexWrap: "wrap" }}>
          {data?.map((item) => {
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

                  },
                  {
                    borderColor: isSelected(item) ? Colors.light.tint : '#ccc',
                    backgroundColor: isSelected(item) ? Colors.light.tint : '#fff',
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
              <TouchableOpacity onPress={() => setTopOpen(true)} style={currentLocal.language == 'العربيه' ? [styles.dropdown, styles.timeBox, { alignItems: "center", justifyContent: "center" }] : [styles.dropdown, { alignItems: "center", justifyContent: "center" }]}>
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
                        initialSelectedIndex={0}
                        items={periods}
                        onChange={({ item }) => setToPeriod(item.value)}
                        selectedStyle={{ borderWidth: 1, paddingVertical: 22 }}

                      />
                    </View>

                  </View>
                  <TouchableOpacity style={[styles.addButton, { flexDirection: "row", justifyContent: "center", marginTop: 12, width: "75%", alignSelf: "center" }]} onPress={() => setTopOpen(!toOpen)}>
                    <Text allowFontScaling={false} style={{ color: '#fff', fontFamily: 'BoldMoto' }}>{currentLocal.home.save}</Text>
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
              <TouchableOpacity onPress={() => setFromOpen(true)} style={currentLocal.language == 'العربيه' ? [styles.dropdown, styles.timeBox, { alignItems: "center" }] : [styles.dropdown, styles.timeBox, { alignItems: "center" }]}>

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
                        selectedStyle={{ borderWidth: 1, paddingVertical: 22 }}
                      />
                    </View>
                    <View>

                      <WheelPickerExpo
                        height={200}
                        width={75}
                        initialSelectedIndex={0}
                        items={periods}
                        onChange={({ item }) => setFromPeriod(item.value)}
                        selectedStyle={{ borderWidth: 1, paddingVertical: 22 }}

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
      if (profile?.type === "service_provider") {
        setNewCertificates((prev) => [...prev, ...newImages]);

      } else {
        setNewShopImages((prev) => [...prev, ...newImages]);

      }
    }
  };





  const cleanTimeFormat = (time) => {
    if (!time) return '';
    // حوّل أرقام عربية لإنجليزية
    let cleaned = convertArabicToEnglishNumbers(time);
    // احذف الثواني لو موجودة
    if (cleaned.split(':')?.length === 3) {
      const [h, m] = cleaned.split(':');
      cleaned = `${h}:${m}`;
    }
    return cleaned;
  };
  const dropdownRenderItem = (item) => (
    <View style={styles.dropdownItem}>
      <Text allowFontScaling={false} style={[styles.dropdownItemText, currentLocal.language == "English" ? styles.enText : styles.arText]}>
        {item.label}
      </Text>
    </View>
  );

  const renderItem = ({ item }) => {
    if(activeTabId=="personal_info"){
       if (item?.typeStatus === "id_image") {
      return (
        <TouchableOpacity style={styles.imagePicker} onPress={() => handleImagePick('id_image')}>
          {formData.id_image ? (
            <Image
              source={{ uri: formData.id_image.uri ? formData.id_image.uri : formData.id_image }}
              style={styles.imagePreview}
            />) : (
            <Text allowFontScaling={false} style={{ fontFamily: "BoldMoto" }}>
              {currentLocal.home.chooseIdImageText}

            </Text>
          )}
        </TouchableOpacity>

      )
    } else {

      return (
        <View style={styles.itemcontainer}>
          {item?.statusKey == "disable" ? (
            <View style={styles.disableInput}>
              <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.disableInputText, styles.arText] : [styles.disableInputText, styles.enText]}>
                {formData[item.key]}
              </Text>
            </View>
          ) : item?.statusKey == "dropdown" ? (
            <CustomDropDown
              data={item?.data}
              value={formData[item.key] || ""}
              onChangeFun={(selected) => handleInputChange(item.key, selected.value)}
              placeholder={item?.placeholder}
              renderItem={dropdownRenderItem}
            />
          ) : (
            <CustomLabelInput
              label={item?.placeholder}
              isPassword={false}
              showPassword={true}

              value={String(formData[item.key] || '')}
              onChangeText={(text) => handleInputChange(item.key, text)}
              phoneState={item?.phoneState}
            />
          )}
        </View>
      );
    }
  }else{

          if (item.key === "dynamic_sections") {

    return(
        <MultiSubCategories
          onChange={(data) => {
            console.log("Selected Subcategories:", data);
            setSelectedSubCategories(data);
  }}
        />
  
    )
        }
  }
  };

  const normalizeToEnglish = (value) => formatNumberByLang(value, "en");


  const handleSubmit = async () => {

    const flatData = newWorkingTimes.flat();



    const formDataa = new FormData();
    formDataa.append("first_name", formData?.first_name);
    formDataa.append("last_name", formData?.last_name);
    formDataa.append("city", formData?.city);
    if (formData?.email !== null) {
      formDataa.append("email", formData?.email);

    }
    formDataa.append("address", formData?.address);
        const phoneRes = await translateAll("", "en", formData?.whatsapp);
    formDataa.append("whatsapp", phoneRes?.formattedNumber);

    formDataa.append("experience_years", normalizeToEnglish(formData?.experience_years));

    if (profile?.type === "service_provider") {
      formDataa.append("experience_description", formData?.experience_description);
      formDataa.append("price", normalizeToEnglish(formData?.price));
      formDataa.append("unit", formData?.unit);
      formDataa.append("card_number", normalizeToEnglish(formData?.card_number));
      if (formData?.id_image && formData?.id_image.uri) {
        formDataa.append("card_image", {
          uri: formData?.id_image.uri,
          type: formData?.id_image.type || "image/jpeg",
          name: formData?.id_image.name || "profile.jpg",
        });
      }

      newCertificates?.forEach((uri, index) => {

        formDataa.append(`certificates[${index}]`, {
          uri: uri?.uri,
          name: uri?.name || `certificates${index}.jpg`,

          type: uri?.type || 'image/jpeg',
        });
      });
    } else {
      formDataa.append("products_description", formData?.experience_description);
      formDataa.append("shop_name", formData?.shop_name);

      newShopImages?.forEach((uri, index) => {

        formDataa.append(`shop_images[${index}]`, {
          uri: uri?.uri,
          name: uri?.name || `shop_images${index}.jpg`,

          type: uri?.type || 'image/jpeg',
        });
      });
    }
    // formDataa.append("sub_category_id", formData?.sub_category_id);
const subCatId = formData?.sub_category_id || formData?.pairs[0]?.subCategoryId;
    if (subCatId && subCatId !== "undefined") {
        formDataa.append("sub_category_id", subCatId);
    } else {
        // إذا كان السيرفر يجبرك على إرسالها، اختر قيمة افتراضية أو نبه المستخدم
        console.warn("sub_category_id is missing!");
    }
    formDataa.append("whatsapp_country_code", countryCode);
    if (workingTimes?.length !== 0) {
      workingTimes?.forEach((item, index) => {
        const startAt = cleanTimeFormat(item.start_at);
        const endAt = cleanTimeFormat(item.end_at);

        formDataa.append(`working_times[${index}][day]`, item.day);
        formDataa.append(`working_times[${index}][start_at]`, startAt);
        formDataa.append(`working_times[${index}][end_at]`, endAt);
      });

    } else {
      flatData.forEach((item, index) => {

        formDataa.append(`working_times[${index}][day]`, item.day);
        formDataa.append(`working_times[${index}][start_at]`, item.start_at);
        formDataa.append(`working_times[${index}][end_at]`, item.end_at);
      });
    }
    if (formData?.profile_image && formData?.profile_image.uri) {
formDataa.append("image", {
  uri: formData?.profile_image.uri,
  name: "profile.jpg",
  type: "image/jpeg",
});
    }





    try {
    setLoading(true);

      const res = await axios.post(`${apiUrl}/user/update-profile`, formDataa, {
        headers: {
          Authorization: `Bearer ${list?.token}`,
          'Content-Type': 'multipart/form-data',
          "Accept-Language": currentLocal.language == "العربيه" ? "ar" : "en"

        },
      });

      dispatch(setuserInfo({
        user: res.data.data,
        access_token: list?.token

      }));

      setLoading(false);
      // router.push("(user)")
      Alert.alert(currentLocal.home.editSuccessAlert);


      setTimeout(() => {
        router.push("(users)"); // or router.replace("/home")
      }, 1500);

     } catch (error) {
    setLoading(false);
    
    // هذا السطر سيطبع لك الخطأ القادم من السيرفر بالتفصيل (مثل خطأ SQL أو PHP)
    if (error.response) {
      Alert.alert("خطأ في السيرفر", Object.values(error.response.data.errors)[0][0]);
        console.log("Server Error Data:", error.response.data);
        console.log("Server Status:", error.response.status);
    } else {
        console.log("Error Message:", error.message);
    }

    Alert.alert("خطأ في السيرفر", "حدث خطأ داخلي في السيرفر (500). يرجى مراجعة Logs السيرفر.");
}
  };
  const handleSubmitCategories = async () => {

const result = SelectedSubCategories.map(item => item.subCategoryId);

    





console.log("Selected Subcategories IDs:", result);
    try {
    setLoading(true);

      const res = await axios.post(`${apiUrl}/user/auth/edit-subcategories`, { sub_category_ids: result }, {
        headers: {
          Authorization: `Bearer ${list?.token}`,
          "Accept-Language": currentLocal.language == "العربيه" ? "ar" : "en"

        },
      });



      setLoading(false);
      // router.push("(user)")
      Alert.alert(currentLocal.home.editSuccessAlert);

      dispatch(setuserInfo({
        user: res.data.data,
        access_token: list?.token

      }));
      setTimeout(() => {
        router.push("(users)"); // or router.replace("/home")
      }, 1500);

     } catch (error) {
    setLoading(false);
    
if (error.response) {
  console.log("Server Error:", error.response.data);

  if (error.response.data.errors) {
    Alert.alert(
      "Error",
      Object.values(error.response.data.errors)[0][0]
    );
    console.log("Validation Errors:", error.response.data.errors);
  } else {
    Alert.alert(
      "Error",
      error.response.data.message || "Unknown server error"
    );
        console.log("Validation Errors:", error.response.data.message);

  }
}

}
  };

  const formattedItems=[
    {title:currentLocal.language=="English"?"Personal data":"البيانات الشخصية", id: "personal_info"},
    {title:currentLocal.home.categoriesLabel, id: "shop_info"}
  ]
    const renderTabsItem = ({ item }) => {
      const isSelected = activeTabId === item?.id;
      return (
        <TouchableOpacity
          style={isSelected ? styles.activeCatContainer : styles.catContainer}
          onPress={() => setActiveTabId(item?.id)}
        >
          <Text allowFontScaling={false} style={isSelected ? styles.activeCatText : styles.catText}>
            { item?.title}
          </Text>
        </TouchableOpacity>
      );
    };
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <CommonHeader
        title={currentLocal.home.profile}
        filterState={false}
        currentLocal={currentLocal}

      />
      

      <FlatList
        data={formFields}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 15 }}
        ListHeaderComponent={
          <>
            <TouchableOpacity style={styles.imageContainer} onPress={() => handleImagePick('profile_image')}>
              <Image
                source={formData.profile_image ? { uri: formData.profile_image.uri ? formData.profile_image.uri : formData.profile_image } : require("../assets/images/Rectangle 5621.png")}
                style={styles.profileImage}
              />
              <View style={styles.cameraIcon}>
                <Text allowFontScaling={false} style={styles.cameraText}>📷</Text>
              </View>
            </TouchableOpacity>
            <ChooseCountry />
    <View style={styles.sectionContainer}>
          <TabsContainer items={formattedItems} renderItem={renderTabsItem} />
        </View>
                  </>
        }
        ListFooterComponent={
activeTabId=="personal_info"&&
          <>
            {profile?.type === "service_provider" ? renderCertificates() : renderShopImages()}

            {renderWorkingTimes()}
            <FlatList
              data={[{}]}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ flexDirection: "row-reverse", paddingVertical: 12 }}

              renderItem={({ item, index }) => {

                return (


                  newWorkingTimes?.length != 0 ?
                    newWorkingTimes.map((item) => {
                      return (
                        <View style={styles.workingTimeCard}>
                          <Text allowFontScaling={false} style={styles.workingTimeText}>
                            {item?.day}</Text>
                          <Text allowFontScaling={false} style={styles.workingTimeText}>
                            {item?.start_at} - {item?.end_at}</Text>
                          <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => handleRemoveNewWorkingTime(index)}
                          >
                            <Text allowFontScaling={false} style={styles.closeButtonText}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      )

                    })
                    : workingTimes?.length != 0 ?
                      workingTimes?.map((item) => {
                        return (
                          <View style={styles.workingTimeCard}>
                            <Text allowFontScaling={false} style={styles.workingTimeText}>
                              {item.day} | {item.start_at?.slice(0, 5)} - {item.end_at?.slice(0, 5)}
                            </Text>
                            <TouchableOpacity
                              style={styles.closeButton}
                              onPress={() => handleRemoveWorkingTime(index)}
                            >
                              <Text allowFontScaling={false} style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                          </View>
                        )

                      })
                      :
                      <></>

                )
              }}
            />
          </>
        }
      />
      <View style={{ paddingHorizontal: 15, paddingBottom: 10 }}>
        <CustomBtn title={currentLocal.home.edit} onPressFun={activeTabId=="personal_info"?handleSubmit:handleSubmitCategories} loading={loading} />
      </View>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,

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
  itemcontainer: { marginBottom: 20 },
  pairBox: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
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
  workingTimeText: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
    fontFamily: "MediumMoto",
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
  timeBox: {
    justifyContent: 'center',
    alignItems: 'flex-end',

  },
  timeText: {
    fontFamily: 'BoldMoto',
    fontSize: 14,
    color: '#333',

  },
  sectionTitle: {
    fontFamily: 'BoldMoto',
    fontSize: 14,
    marginBottom: 10,
    color: Colors.light.tint,
  },
  disableInput: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
    minHeight: Dimensions.get('screen').height / 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: "center",
    backgroundColor: '#f2f2f2'
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  }, imageContainer: {
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
    height: 100,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: "center",
    marginTop: 8,
    height: Dimensions.get('screen').height / 16,

  },
  disableInputText: { fontFamily: "MediumMoto", color: "#999" },
  arText: { textAlign: "right" },
  enText: { textAlign: "left" },
  dropdownItem: { padding: 10 },
  closeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
    certificateImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  dropdownItemText: { fontFamily: 'BoldMoto', color: '#000' },
    catContainer: {
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: Colors.light.tint,
      alignContent: "center",
      marginHorizontal: 4,
      borderRadius: 8
  
    },
    activeCatContainer: {
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: Colors.light.tint,
      alignContent: "center",
      marginHorizontal: 4,
      borderRadius: 8,
      backgroundColor: Colors.light.tint
  
    },
    catText: {
      fontSize: 14,
      textAlign: 'center',
      fontFamily: 'BoldMoto',
      color: Colors.light.tint,
    },
    activeCatText: {
      fontSize: 14,
      textAlign: 'center',
      fontFamily: 'BoldMoto',
      color: "#fff",
    },
    sectionContainer:{
      marginVertical:22
    }
});