import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, FlatList, ImageBackground, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';
import { fetchAds } from '../hooks/adsReducer';
const { width, height } = Dimensions.get("window");

const AllAdsScreen = () => {
  const dispatch = useDispatch()
  const { currentLocal } = useSelector((state) => state.Localization);
  const { list: ads, loading:adsLoading } = useSelector((state) => state.adsReducer);
  const handleRefresh=()=>{
    dispatch(fetchAds())

  }  
  useEffect(() => {
handleRefresh()
  }, [])
  const insets = useSafeAreaInsets();
  const Params = useLocalSearchParams();
  const marker = Params.marker
  const dataItem = JSON.parse(marker || '{}');

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, }]}>

              <CommonHeader
          title={currentLocal.home.allAds}
        filterState={false}
        currentLocal={currentLocal}

      />

      <View style={{ marginTop: 12 }}>
        <FlatList
          data={ads}
          keyExtractor={(item) => item?.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 100 : 20 }}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <ImageBackground
                source={{ uri: currentLocal.language === "العربيه" ? item?.image_ar : item?.image_en }}
                style={styles.headerBg}
                resizeMode="contain" // or "contain" depending on your design
              >
                <View style={styles.overlay}>
                  <View style={{ justifyContent: "space-between", flex: 1, }}>


                  </View>
                  <View
                    style={{
                      flexDirection: currentLocal.language === 'العربيه' ? 'row' : 'row-reverse',
                      justifyContent: currentLocal.language === 'العربيه' ? "flex-start" : "flex-end"
                    }}
                  >
{item?.user_id&&
                    <TouchableOpacity
                      style={{ paddingVertical: 8, borderWidth: 1, alignSelf: "flex-end", borderColor: "#fff", marginTop: 7, justifyContent: "center", alignItems: "center", borderRadius: 5, paddingHorizontal: 18 }}
                      onPress={() => router.push({
                        pathname: '/(routes)/UserDetails', params: { marker: JSON.stringify(item?.user) },

                      })}
                    >

                      <Text allowFontScaling={false} style={styles.subTitle}>{currentLocal.home.showAd}</Text>
                    </TouchableOpacity>
          }
                  </View>
                </View>
              </ImageBackground>
            </View>
          )}

                refreshing={adsLoading}
                      refreshControl={
                        <RefreshControl
                          refreshing={adsLoading}
                          onRefresh={handleRefresh}
                          tintColor={"#fff"}
                          colors={["#fff"]}
                          progressViewOffset={25}
                        />
                      }
          
        />

      </View>
    </View>

  )
}

export default AllAdsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,
  },
  headerBg: {
    height: Dimensions.get("screen").height * 0.3,
    marginBottom: 22,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)", // optional dark overlay
    paddingBottom: 20,
    paddingHorizontal: Dimensions.get('screen').width / 28,

  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  subTitle: {
    color: "#fff",
    textAlign: "right",
    fontFamily: 'MediumMoto',
    fontSize: 12


  }
})
