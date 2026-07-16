import { Colors } from '@/constants/theme';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Keyboard, KeyboardAvoidingView, Modal, PixelRatio, Platform, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { useDispatch, useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';
import TabsContainer from '../components/TabsContainer';
import { fetchContactList } from '../hooks/contactList';
import { router } from 'expo-router';
const fontScale = PixelRatio.getFontScale();

const RatingsAndCommentScreen = () => {
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.authorization);
  const { list: contactList,loading: contactListLoading } = useSelector((state) => state.contactList);
  // const [contactList, setContactList] = useState([])
  const [show, setShow] = useState(false)
  
  const [Ratingshow, setRatingshow] = useState(false)
  const [userId, setUserId] = useState(null)
  const [comment, setComment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [activeCategoryID, setActiveCategoryID] = useState(null);

  const { currentLocal } = useSelector((state) => state.Localization);



  const token = userinfo.token;


  const fetchData = useCallback(async () => {
    dispatch(fetchContactList())

  }, []);

  useEffect(() => {

    if (isFocused) {
      fetchData();
    }
  }, [isFocused])
  const handleVerify = async () => {

    setLoading(true);

    try {
      // Show loading indicator if needed
      const response = await axios.post(
        `https://nanosoft.technology/osta-basha/api/client/rate/${userId}`,
        {
          rate: rating,
          comment: comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": currentLocal.language == "العربيه" ? "ar" : "en"
          },
        }

      );


      setRating(0);
      setComment(null);
      setShow(false)
      fetchData()
    } catch (error) {
      console.error(error, "ratingError");

      // Extract error message if available
      const message =
        error.response?.data?.message || 'حدث خطأ أثناء تغيير كلمة المرور';
      Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };
  const closeModal = () => setShow(false)
  const closeRatingModal = () => setRatingshow(false)
const formattedItems = React.useMemo(() => {
  try {
    const data =
      typeof contactList === "string"
        ? JSON.parse(contactList)
        : contactList;

    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}, [contactList]);

// Unique sub categories for Tabs
const uniqueSubCategories = React.useMemo(() => {
  const map = new Map();

  formattedItems.forEach(item => {
    const sub = item.sub_category;

    if (sub && !map.has(sub.id)) {
      map.set(sub.id, sub);
    }
  });

  return Array.from(map.values());
}, [formattedItems]);
useEffect(() => {
  if (uniqueSubCategories.length > 0 && activeCategoryID == null) {
    setActiveCategoryID(uniqueSubCategories[0].id);
  }
}, [uniqueSubCategories]);
  // const formattedItems = React.useMemo(() => {
  //   try {
  //     console.log(contactList, "contactListcontactList");
  //     const data = typeof contactList === 'string' ? JSON.parse(contactList) : contactList;
  //     return Array.isArray(data) ? data : [];
  //   } catch (e) {
  //     console.error("Parsing error:", e);
  //     return [];
  //   }
  // }, [contactList]);
  useEffect(() => {
    if (formattedItems?.length > 0 && activeCategoryID === null) {
      setActiveCategoryID(formattedItems[0]?.sub_category?.id);
    }
  }, [formattedItems]);


  // const renderItem = ({ item }) => {
  //   const isSelected = activeCategoryID === item?.sub_category?.id;
  //   return (
  //     <TouchableOpacity
  //       style={isSelected ? styles.activeCatContainer : styles.catContainer}
  //       onPress={() => setActiveCategoryID(item?.sub_category?.id)}
  //     >
  //       <Text allowFontScaling={false} style={isSelected ? styles.activeCatText : styles.catText}>
  //         {currentLocal.language === 'العربيه'
  //           ? item?.sub_category?.title_ar
  //           : item?.sub_category?.title_en}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };
const renderItem = ({ item }) => {
  const isSelected = activeCategoryID === item.id;

  return contactListLoading?(
    <>
              <View style={{height: 25,width: "100%",backgroundColor: "#f0f0f0",borderRadius: 8,marginVertical: 8}}/>

    </>
  ):(
    <TouchableOpacity
      style={isSelected ? styles.activeCatContainer : styles.catContainer}
      onPress={() => setActiveCategoryID(item.id)}
    >
      <Text
        allowFontScaling={false}
        style={isSelected ? styles.activeCatText : styles.catText}
      >
        {currentLocal.language === "العربيه"
          ? item.title_ar
          : item.title_en}
      </Text>
    </TouchableOpacity>
  );
};
  const filteredReview = React.useMemo(() => {
    if (!activeCategoryID) return formattedItems;
    console.log(activeCategoryID, "activeCategoryID");

    // نقوم بالفلترة من المصفوفة الجاهزة contactList
    return formattedItems.filter(item => item?.sub_category?.id === activeCategoryID);
  }, [activeCategoryID, formattedItems]);
console.log(formattedItems,"formattedItems");


  return (

    <View style={styles.container}>

      <CommonHeader
        title={currentLocal.home.serviceRatingHeader}
        filterState={false}
        currentLocal={currentLocal}

      />
      <View style={styles.sectionContainer}>
        <TabsContainer items={uniqueSubCategories} renderItem={renderItem} />
      </View>
      <View style={{ marginTop: 22, flex: 1 }}>
        <FlatList
          data={filteredReview}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 80 : 20, flex: 1 }}
          renderItem={({ item }) => {

            return contactListLoading?(
                              <View style={{height: 100,width: "100%",backgroundColor: "#f0f0f0",borderRadius: 8,marginVertical: 8}}/>
              
            )
            :(
              <TouchableOpacity style={currentLocal.language == 'العربيه' ? [styles.itemContainer, { flexDirection: "row-reverse" }] : [styles.itemContainer, { flexDirection: "row" }]}

              >
                <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", flex: 1 }}>
                  <View>
                    {item?.image ?
                      <Image source={{ uri: item?.type !== "shop_owner" ? item?.image : item?.shop_images[0].image }} style={styles.image} />

                      :
                      <View style={[
                        styles.image, {
                          justifyContent: "center",
                          alignItems: "center"
                        }
                      ]}>

                        <FontAwesome name="user" size={75} color="gray" style={{ alignSelf: "center" }} />
                      </View>

                    }                  </View>
                  <View style={{ marginLeft: 5, flex: 1 }}>
                    <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.name, { textAlign: "right" }] : [styles.name, { textAlign: "left" }]}>{item?.user?.first_name + " " + item?.user?.last_name}</Text>
                    <Text allowFontScaling={false}
                      style={currentLocal.language == 'العربيه' ? [styles.category, { textAlign: "right" }] : [styles.category, { textAlign: "left" }]}>
                      ({currentLocal.language == 'العربيه' ? item?.user?.profile?.sub_category?.title_ar : item?.user?.profile?.sub_category?.title_en})  {currentLocal.language == 'العربيه' ? item?.profile?.user?.sub_category?.category?.title_ar : item?.profile?.user?.sub_category?.category?.title_en}</Text>


                    {item?.user?.type !== "shop_owner" &&
                      <View
                        style={currentLocal.language == 'العربيه' ? [styles.priceContainer, { flexDirection: "row-reverse" }] : [styles.priceContainer, { flexDirection: "row" }]}>

                        <Text allowFontScaling={false} style={styles.priceTitle}>{currentLocal.home.priceTitle}</Text>

                        {/* <Text allowFontScaling={false}style={styles.price}>ابتداءً من  {item?.user?.profile?.price} {item?.user?.currency}</Text> */}
                        <Text allowFontScaling={false} style={styles.price}>
                          {currentLocal.home.priceFrom} {item?.user?.profile?.price} {item?.user?.currency}
                        </Text>
                      </View>
                    }
                    <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", alignItems: "center", justifyContent: "space-between", marginVertical: 8, marginEnd: 15 }}>
                      <Text allowFontScaling={false} style={styles.category}>{item?.created_at}</Text>

                      {!item?.comment &&

                        <TouchableOpacity style={{ alignItems: "flex-end" }} onPress={() => {
                          if(userinfo?.userInfo?.first_name && userinfo?.userInfo?.last_name && userinfo?.userInfo?.email && userinfo?.userInfo?.whatsapp){
                          setShow(true)
                          setUserId(item?.id)
                          }else{
                                                        setRatingshow(true);

                          }
                        }}>
                          <Text allowFontScaling={false} style={{ textDecorationLine: "underline", fontSize: 16, fontFamily: 'BoldMoto', }}>تقييم</Text>
                        </TouchableOpacity>
                      }
                    </View>

                  </View>

                </View>

              </TouchableOpacity>
            )
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text allowFontScaling={false} style={styles.emptyText}>{currentLocal.home.emptyItemsText}</Text>
            </View>
          }

          refreshing={isLoading}
          onRefresh={fetchData}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchData}
              tintColor={Colors.dark.tint}
              colors={[Colors.dark.tint]}
              progressViewOffset={25}
            />
          }


        />
      </View>
  <Modal
        visible={Ratingshow}
        transparent
        animationType="fade"
        onRequestClose={closeRatingModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.containerModal}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={{ flex: 1 }}
            >
              <View style={styles.modalRateBottomWrapper}>
                <View style={styles.filterRateContainer}>
                  <View style={styles.headerCointainer}>
                    <Text></Text>
                    <TouchableOpacity onPress={closeRatingModal}>
                      <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>

                  <View>
          
            <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.label, { textAlign: "center" }] : [styles.label, , { textAlign: "left" }]}>
                {'برجاء أستكمال بياناتك الشخصية لتتمكن من تقييم الخدمات وترك تعليقك'}
              </Text>
                    <TouchableOpacity
                      style={[styles.btnContainer, loading && styles.btnDisabled]}
                      onPress={()=>{
                        setRatingshow(false);
                        router.push("/(routes)/Profile")
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text allowFontScaling={false} style={styles.btnText}>{currentLocal.home.profile}</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={show}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.containerModal}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={{ flex: 1 }}
            >
              <View style={styles.modalBottomWrapper}>
                <View style={styles.filterContainer}>
                  <View style={styles.headerCointainer}>
                    <Text></Text>
                    <TouchableOpacity onPress={closeModal}>
                      <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>

                  <View>
                    <View style={{ marginBottom: 12 }}>
                      <Rating
                        type="star"
                        ratingCount={5}
                        imageSize={30}
                        startingValue={rating}
                        style={styles.starRating}
                        onFinishRating={(value) => setRating(value)}
                      />
                    </View>
                    <View>
                      <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.label, { textAlign: "right" }] : [styles.label, , { textAlign: "left" }]}>{currentLocal.home.leaveCommentLabel}</Text>
                      <TextInput
                        style={{
                          height: 150,
                          borderWidth: 1,
                          borderRadius: 12,
                          padding: 10,
                          textAlignVertical: 'top',
                          textAlign: currentLocal.language == 'العربيه' ? "right" : "left",
                          fontSize: 14 / fontScale,
                          fontFamily: 'MediumMoto',

                        }}
                        multiline
                        value={comment}
                        onChangeText={setComment}
                      />
                    </View>
                    <TouchableOpacity
                      style={[styles.btnContainer, loading && styles.btnDisabled]}
                      onPress={handleVerify}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text allowFontScaling={false} style={styles.btnText}>{currentLocal.home.sendButtonText}</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


    </View>


  )
}

export default RatingsAndCommentScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,
  },
  image: {
    borderRadius: 12,
    resizeMode: 'contain',
    marginBottom: 7,
    width: 75,
    height: 90,
    marginStart: 5
  },
  name: {
    fontFamily: 'BoldMoto',
    fontSize: 12,
    textAlign: 'left',
    marginHorizontal: 7,
    marginTop: 12
  },
  category: {
    textAlign: 'left',
    fontSize: 12,
    fontFamily: 'MediumMoto',
    marginBottom: 5
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 5,
  },

  priceTitle: {
    textAlign: 'left',
    fontFamily: 'BoldMoto',
    fontSize: Dimensions.get('screen').width / 33

  },
  price: {
    textAlign: 'left',
    fontFamily: 'MediumMoto',
    flexWrap: 'wrap',
    flexShrink: 1,
    fontSize: Dimensions.get('screen').width / 33
  },
  totalRating: {
    fontFamily: 'MediumMoto',
    fontSize: 10,
    color: "#5C5F62"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'MediumMoto',
    color: '#999',
  },
  itemContainer: {
    marginBottom: 7,
    borderColor: "#ededed",
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  containerModal: {
    height: Dimensions.get('window').height / 1,
    // backgroundColor:"red",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: "center",
    alignItems: "center"

  },
  filterContainer: {
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width / 1,
    bottom: 0,
    left: 0,
    right: 0,
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    padding: 22,
    backgroundColor: "#fff",
    justifyContent: "space-between",

  },
  filterRateContainer: {
    height: Dimensions.get('window').height / 3,
    width: Dimensions.get('window').width / 1.2,


    // position: "absolute",
    borderRadius: 22,
    padding: 22,
    backgroundColor: "#fff",
    justifyContent: "space-between",

  },
  headerCointainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  btnContainer: {
    backgroundColor: Colors.light.tint,
    height: Dimensions.get('screen').height / 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginVertical: 22,
    marginHorizontal: 22

  },
  btnText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'BoldMoto',
  },
  label: {
    fontSize: 12,
    color: '#444',
    marginBottom: 3,
    fontFamily: "SemiBoldMoto",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  modalBottomWrapper: {
    justifyContent: 'flex-end', // 👈 Pushes modal to bottom
    flex: 1,
  },  
   modalRateBottomWrapper: {
    justifyContent: 'center', // 👈 Pushes modal to bottom
    flex: 1,
  }, 
  btnDisabled: {
    backgroundColor: "#aaa",
  },
  sectionContainer: {
    marginTop: 22
  },
  arTitle: {
    fontFamily: 'MediumMoto',
    color: '#686868ff',
    textAlign: "right",
    marginVertical: 12,
    fontSize: 16

  },

  enTitle: {
    fontFamily: 'MediumMoto',
    color: '#686868ff',
    textAlign: "left", marginVertical: 12,
    fontSize: 16
  },

  activeCatText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'BoldMoto',
    color: "#fff",
  },

  catText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'BoldMoto',
    color: Colors.light.tint,
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
  catContainer: {
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    alignContent: "center",
    marginHorizontal: 4,
    borderRadius: 8

  },
})