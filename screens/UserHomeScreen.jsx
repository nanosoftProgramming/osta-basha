import { Colors } from '@/constants/theme'; // Ensure you have this Colors file in place
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import axios from 'axios';
import { useMemo } from "react";
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Linking, Modal, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import CustomCard from '../components/CustomCard';
import { fetchCategories } from '../hooks/categoriesReducer';
import { unReadNotificationsCount } from '../hooks/notificationsReducer';
import { fetchProfile } from '../hooks/ProfileReducer';
import SkiltonContainer from '../components/SkiltonContainer';

const UserHomeScreen = () => {
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.authorization);
  const { list: profile,loading:profileLoading } = useSelector((state) => state.profile);
  const [show, setShow] = useState(false);
  const [activeCategoryID, setActiveCategoryID] = useState(null);
  const [activeShow, setActiveShow] = useState(false);
  const [userList, setUserList] = useState(null);
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const { unReadNotificationsCount: notificationCount,lonotificationing:notificationLoading } = useSelector((state) => state?.notifications);
const [userLiatLoading, setuserLiatLoading] = useState(true)
  const handleWhatsApp = async () => {
    if (Object.keys(userinfo?.userInfo)?.length !== 0) {
      const message = 'مرحبًا';
      const token = userinfo.token;
      const whatsappNumber = dataItem?.whatsapp_country_code + dataItem?.whatsapp
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      try {
        await axios.post(
          `https://nanosoft.technology/osta-basha/api/client/contact`,
          { contactable_id: dataItem?.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Accept-Language": currentLocal.language === "العربيه" ? "ar" : "en",
            },
          }
        );

        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('لا يمكن فتح واتساب. تأكد من تثبيت التطبيق.');
        }
      } catch (error) {
        Alert.alert("خطأ", error?.response?.data?.message || error.message || "حدث خطأ أثناء فتح واتساب");
      }
    } else {
                router.push({pathname:"/(routes)/Login",params:{previousScreen:"(users)/UserHome"}})
    }
  };
  useFocusEffect(
    useCallback(() => {


      if (userinfo?.userInfo?.profile?.is_active === 0) {
        setActiveShow(true);
      }

      return () => {
        // تنظيف عند الخروج من الشاشة
        setShow(false);
        setActiveShow(false);
      };
    }, [userinfo?.userInfo])
  );
//   const getData = async () => {

// console.log(profile,"profile?.profile");


//     // setActiveCategoryID(profile?.profile?.sub_categories?.[0]?.id)

//     const token = userinfo.token;

//     try {
//       setIsLoading(true);

//       const res = await axios.get(`https://nanosoft.technology/osta-basha/api/user/received-contacts`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Accept-Language": currentLocal.language == "العربيه" ? "ar" : "en"
//         },
//       });
// setuserLiatLoading(false)      
//       setUserList(res.data.data);
//       setIsLoading(false)

//     } catch (error) {
//       setIsLoading(false)
//       setuserLiatLoading(false)      


//     }
//     dispatch(unReadNotificationsCount())
//     dispatch(fetchProfile())
//     dispatch(fetchCategories())

//   };



const getData = async () => {
  const token = userinfo.token;

  try {
    setIsLoading(true);

    const res = await axios.get(
      `https://nanosoft.technology/osta-basha/api/user/received-contacts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language":
            currentLocal.language === "العربيه" ? "ar" : "en",
        },
      }
    );

    setUserList(res.data.data);
    setuserLiatLoading(false);
  } catch (error) {
    console.log(error);
    setuserLiatLoading(false);
  } finally {
    setIsLoading(false);
  }

  dispatch(fetchProfile());
  dispatch(fetchCategories());
  dispatch(unReadNotificationsCount());
};

useEffect(() => {

    getData();
  }, [])
useEffect(() => {
  if (
    profile?.profile?.sub_categories?.length > 0 &&
    activeCategoryID == null
  ) {
    setActiveCategoryID(profile.profile.sub_categories[0].id);
  }
}, [profile]);
  const packageTitle = userinfo?.userInfo?.profile?.package?.title;
  const startDate = userinfo?.userInfo?.profile?.start_date;
  const times = userinfo?.userInfo?.free_trial_remaining_times;
  const { currentLocal } = useSelector((state) => state.Localization);
  const renderItem = ({ item }) => {
    console.log(item,"ttttttt");
    
return profileLoading ? (
  <SkiltonContainer
    loading={profileLoading}
    data={
      <View
        style={{
          width: 100,
          height: 30,
          borderRadius: 15,
          backgroundColor: '#E0E0E0',
          marginHorizontal: 4,
        }}
      />
    }
  />
) : (
  <TouchableOpacity
    style={
      activeCategoryID === item?.id
        ? styles.activeCatContainer
        : styles.catContainer
    }
    onPress={() => setActiveCategoryID(item?.id)}
  >
    <Text
      allowFontScaling={false}
      style={
        activeCategoryID === item?.id
          ? styles.activeCatText
          : styles.catText
      }
    >
      {currentLocal.language === 'العربيه'
        ? item?.title_ar
        : item?.title_en}
    </Text>
  </TouchableOpacity>
);

  }
  // const filteredData = activeCategoryID 
  // ? userList?.filter(item => item.sub_category_id === activeCategoryID)
  // : userList;
  console.log(profile?.profile?.sub_categories,"profile?.profile?.sub_categories");
  
const filteredData = useMemo(() => {
  // لم يصل userList بعد
  if (!userList) return [];

  // لم يصل profile بعد
  if (profileLoading) return [];

  // لم تصل sub_categories بعد
  if (!profile?.profile?.sub_categories?.length) return [];

  // لم يتم تحديد أول Category بعد
  if (activeCategoryID == null) return [];

  return userList.filter(
    item => String(item.sub_category_id) === String(activeCategoryID)
  );
}, [userList, profileLoading, profile, activeCategoryID]);  return (

      <View style={[styles.container,{paddingBottom: insets.bottom + 25, flex: 1 }]}>
        {notificationLoading?
       <>
<SkiltonContainer
loading={notificationLoading}
data=
{<View style={{ width: Dimensions.get('window').width - 40, height: 40, backgroundColor: "#E0E0E0", borderRadius: 10 }} />}
/>
       </> 
      :
        <View style={currentLocal.language === 'العربيه' ? [styles.header, { flexDirection: "row-reverse" }] : [styles.header, { flexDirection: "row" }]}>
          <Image source={require('../assets/images/logo-removebg-preview.png')} style={{ width: 80, height: 80, resizeMode: "contain", borderRadius: 40 }} />
          <TouchableOpacity
            onPress={() => {
              if (userinfo?.token) {
                router.push("/(routes)/Notifications")
              } else {
                router.push({pathname:"/(routes)/Login",params:{previousScreen:"(users)/UserHome"}})
              }
            }}

          >
            {notificationCount?.length !== 0 &&
              <View
                style={{
                  backgroundColor: "red",
                  borderRadius: 50,

                  minWidth: 25,
                  minHeight: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  left: 12,
                  bottom: 22,
                  zIndex: 1000000
                }}
              >
                <Text allowFontScaling={false} 
                  style={{ color: "#fff", fontFamily: "BoldMoto", }}
                >{notificationCount}</Text>

              </View>
            }
            <Ionicons name="notifications" size={32} color="black" />

          </TouchableOpacity>
        </View>
      }

        {userinfo.userInfo?.first_name !== null &&
          <View style={styles.paymentContainer}>

            <Text allowFontScaling={false} style={currentLocal.language === 'العربيه' ? [styles.paymentType, { textAlign: "right" }] : [styles.paymentType, { textAlign: "left" }]}>
              {userinfo?.userInfo?.profile?.status == "free_trial"
                ? currentLocal.home.currentStatusFreeTrial
                : currentLocal.home.currentStatusPackage.replace('{{packageTitle}}', packageTitle)}
            </Text>
            {
              userinfo?.userInfo?.profile?.package ?

                <>
                  <Text allowFontScaling={false} style={currentLocal.language === 'العربيه' ? [styles.paymentType, { textAlign: "right" }] : [styles.paymentType, { textAlign: "left" }]}>سوف تبدأ يوم {userinfo?.userInfo?.profile?.start_date}</Text>
                  <Text allowFontScaling={false} style={currentLocal.language === 'العربيه' ? [styles.paymentType, { textAlign: "right" }] : [styles.paymentType, { textAlign: "left" }]}>لمدة   {userinfo?.userInfo?.profile?.package?.duration} يوم</Text>

                </>
                :
                <>

                  <Text allowFontScaling={false} style={currentLocal.language === 'العربيه' ? [styles.paymentType, { textAlign: "right" }] : [styles.paymentType, { textAlign: "left" }]}>
                    {currentLocal.home.startDateText.replace('{{startDate}}', startDate)}
                  </Text>


                  <Text allowFontScaling={false} style={currentLocal.language === 'العربيه' ? [styles.paymentType, { textAlign: "right" }] : [styles.paymentType, { textAlign: "left" }]}>

                    {currentLocal.home.remainingContactsText.replace('{{times}}', times)}
                  </Text>
                </>
            }

          </View>
        }

        <Text allowFontScaling={false} style={currentLocal.language === 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}>

          {currentLocal.home.clientsListTitle}</Text>
                {/* {profile?.type === "service_provider" && */}

        <View style={{ height: 50, marginBottom: 10 }}> 


          <FlatList
            data={profile?.profile?.sub_categories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            inverted={currentLocal.language === "العربيه"}

            contentContainerStyle={{
              paddingVertical: 10,
              flexGrow: 1,
              justifyContent: "flex-start",
            }}
          />
        </View>
{/* } */}
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => item?.id?.toString() || index?.toString()}
          showsVerticalScrollIndicator={false}

          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              {isLoading ?
              <SkiltonContainer
                loading={isLoading}
                data={
                  <View
                    style={{
                      width: '100%',
                      height: 100,
                      backgroundColor: '#E0E0E0',
                      borderRadius: 5,
                      marginBottom: 10,
                    }}
                  />
                }
              />
            :
                          <CustomCard item={item} />

            
            }
            </View>
          )}
          ListEmptyComponent={
            <View style={{ flex: 1 }}>
              <Text allowFontScaling={false} style={[styles.title, { textAlign: 'center', marginTop: 20 }]}>
                {currentLocal.home.noOrdersText}
              </Text>
            </View>
          }
          refreshing={isLoading}
          onRefresh={getData}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={getData}
              tintColor={Colors.light.tint}
              colors={[Colors.light.tint]}
              progressViewOffset={25}
            />
          }
        />


        <Modal
          visible={show}
          transparent
          animationType="fade"
          onRequestClose={() => setShow(false)}
        >

          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={{ alignItems: "flex-end", width: "100%" }}
                onPress={() => setShow(false)}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.modalText}>{currentLocal.home.enterDataModalText}</Text>

              <TouchableOpacity onPress={() => {
                setShow(false)
                                router.push({
                  pathname:'/(routes)/Add',
                    params: { from: 'UserHome' }  

                });

                // router.push('/(routes)/Add')
              }} style={styles.modalButton}>
                <Text allowFontScaling={false} style={styles.modalButtonText}>
                  {currentLocal.home.okButtonText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={activeShow}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveShow(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={{ width: "100%" }} onPress={() => {
                setActiveShow(false)
              }}>
                <Text allowFontScaling={false} style={{ textAlign: "left", fontSize: 25, fontWeight: "semibold" }}>x</Text>
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.modalText}>{currentLocal.home.contactSupportText}</Text>
              <View style={{
                paddingHorizontal: Dimensions.get('screen').width / 28,
                flexDirection: "row",
                justifyContent: "space-between"

              }}>
                <TouchableOpacity style={styles.boxContainer} onPress={handleWhatsApp}>
                  <Text allowFontScaling={false} style={styles.textBox}>{currentLocal.home.useWhatsAppText}</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </Modal>


      </View>
  )
}

export default UserHomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Dimensions.get('screen').height / 18,
    paddingHorizontal: Dimensions.get('screen').width / 28,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  title: {
    fontFamily: "BoldMoto",
    fontSize: 16,
    marginBottom: 12
  },
  itemContainer: {
    marginTop: 22
  },
  itemsContainer: {
    flex: 1,
    backgroundColor: "red"
  },
  paymentContainer: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    marginBottom: 22,
    borderRadius: 12
  },
  paymentType: {
    color: "#fff",
    fontFamily: "BoldMoto",
  },
  paymentTime: {
    color: "#fff",
    fontFamily: "MediumMoto"
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: "MediumMoto",
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontFamily: "BoldMoto",
  },
  boxContainer: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22
  },
  textBox: {
    color: "#fff",
    fontFamily: "MediumMoto",
    marginEnd: 7
  },
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

})
