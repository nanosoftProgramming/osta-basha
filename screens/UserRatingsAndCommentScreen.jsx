import { Colors } from '@/constants/theme';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Linking, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';
import SkiltonContainer from '../components/SkiltonContainer';
const UserRatingsAndCommentScreen = () => {
  const userinfo = useSelector((state) => state.authorization);
  const { list: profile } = useSelector((state) => state.profile);
  const [contactList, setContactList] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();
  const { currentLocal } = useSelector((state) => state.Localization);
  const [activeCategoryID, setActiveCategoryID] = useState(null);



  const token = userinfo.token;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await axios.get(`https://nanosoft.technology/osta-basha/api/user/received-contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": currentLocal.language == "العربيه" ? "ar" : "en"
        },
      });
console.log(res.data.data);

      setContactList(res.data.data);
      setIsLoading(false)

    } catch (error) {
      setIsLoading(false)


    }
  }, []);

  useEffect(() => {

    if (isFocused) {
      fetchData();
    }
  }, [isFocused])



console.log(profile?.profile?.sub_categories);

  const isValidName = (name) =>
    typeof name === "string" &&
    name.trim() !== "" &&
    name.trim().toLowerCase() !== "null" &&
    name.trim().toLowerCase() !== "undefined";
  const catRenderItem = ({ item }) => {
console.log(item);

    return (
      <TouchableOpacity style={activeCategoryID == item?.id ? styles.activeCatContainer : styles.catContainer} onPress={() => setActiveCategoryID(item?.id)}>
        <Text  allowFontScaling={false}  style={activeCategoryID == item?.id ? styles.activeCatText : styles.catText}>{currentLocal.language === 'العربيه' ? item?.title_ar : item?.title_en}</Text>
      </TouchableOpacity>

    )
  }
  
const filteredContacts = useMemo(() => {
    console.log(activeCategoryID);

  return contactList
    ?.filter(item => item?.rate !== null)
    ?.filter(item => {
      if (!activeCategoryID) return true;
      return item?.sub_category_id === activeCategoryID;
    });
}, [contactList, activeCategoryID]);
const renderSkeleton = () => {
return(
  <>
      <View style={{ width: Dimensions.get('window').width - 20, height: 150, borderRadius: 10, backgroundColor: '#E0E0E0' }} />
  </>
      

)
}
  return (
    <View style={styles.container}>


                        <CommonHeader
          title={currentLocal.home.rateService}
        filterState={false}
        currentLocal={currentLocal}

      />
      {profile?.type === "service_provider" &&
        <View style={{ height: 50, marginVertical: 10 }}> {/* أضف حاوية بارتفاع محدد */}


          <FlatList
            data={profile?.profile?.sub_categories}
            renderItem={catRenderItem}
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
      }
      
      <View style={{ marginTop: 22 }}>
        <FlatList
          data={filteredContacts} // Only items with rate not null
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 80 : 20 }}

          renderItem={({ item }) => {

            return (
                                <>

                {isLoading ? (
    <SkiltonContainer
    loading={isLoading}
    data={renderSkeleton()}
    />
) : (
                  <>
                                <View style={{ borderWidth: 1, borderColor: "gray", padding: 8, borderRadius: 8, marginBottom: 7 }}>

                <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", alignItems: "center", }}>
                  <View>
                    <Image source={{ uri: item?.client?.image }} style={{ width: 50, height: 50, resizeMode: "contain", borderRadius: 25 }} />
                  </View>
                  <View style={{ marginHorizontal: 5 }}>
                    {isValidName(item?.client?.first_name) && (
                      <Text  allowFontScaling={false} 
                        style={
                          currentLocal.language === 'العربيه'
                            ? [styles.label, { textAlign: "right" }]
                            : [styles.label, { textAlign: "left" }]
                        }
                      >
                        {currentLocal.home.clientLabel}{" "}
                        <Text allowFontScaling={false} style={styles.value}>
                          {item?.client?.first_name} {item?.client?.last_name}
                        </Text>
                        <Text allowFontScaling={false} style={styles.value}>
                          {item?.client?.phone}
                        </Text>
                      </Text>
                    )}
                    {/* <Text allowFontScaling={false}style={styles.name}>{item?.client?.first_name} {item?.client?.last_name}</Text> */}
                    <View style={[styles.itemContainer, { borderWidth: 0 }]}>
                      <Text allowFontScaling={false} style={styles.totalRating}>({item?.rate})</Text>

                      <Rating
                        type='star'
                        ratingCount={5}
                        imageSize={18}
                        style={styles.starRating}
                        readonly={true}
                        startingValue={item?.rate}
                      />


                    </View>
                    <Text allowFontScaling={false} style={styles.category}>{item?.comment}</Text>
                  </View>

                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <TouchableOpacity style={styles.boxContainer} onPress={async () => {
                    const url = `https://wa.me/${item?.client?.whatsapp_country_code + item?.client?.whatsapp}`;
                    const supported = await Linking.canOpenURL(url);
                    if (supported) {
                      await Linking.openURL(url);
                    } else {
                      Alert.alert('لا يمكن فتح واتساب. تأكد من تثبيت التطبيق أو وجود متصفح صالح.');
                    }

                  }}>
                    <Text allowFontScaling={false} style={styles.textBox}>

                      {currentLocal.home.UseWhatsApp}
                    </Text>
                    {/* <Whatsapp width={25} height={25} /> */}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.boxContainer} onPress={() => {
                    const phoneNumber = `tel:${item?.client?.country_code + item?.client?.phone}`; // replace with actual number
                    Linking.openURL(phoneNumber);

                  }}>
                    <Text allowFontScaling={false} style={styles.textBox}>
                      {currentLocal.home.Callbyphone}

                    </Text>
                    {/* <Call width={25} height={25} /> */}

                  </TouchableOpacity>
                </View>
                              </View>

                </>
                )}
</>            )
          }
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text allowFontScaling={false} style={styles.emptyText}>
                {currentLocal.home.noitems}

              </Text>
            </View>
          }

          refreshing={isLoading}
          onRefresh={fetchData}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchData}
              tintColor={Colors.light.tint}
              colors={[Colors.light.tint]}
              progressViewOffset={25}
            />
          }


        />
      </View>

    </View>
  )


}

export default UserRatingsAndCommentScreen

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

  },
  filterContainer: {
    height: Dimensions.get('window').height / 2,
    // position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
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
  boxContainer: {
    backgroundColor: Colors.light.tint,
    width: "49%",
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
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