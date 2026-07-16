import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';
import CustomBtn from '../components/CustomBtn';
import { fetchCountries } from '../hooks/Countries';
import { locationData } from '../hooks/LoacationSettings';
import LoadingScreen from './LoadingScreen';


const CountryScreen = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const locationInfo = useSelector((state) => state.location);
  const { currentLocal } = useSelector((state) => state.Localization);
  const { list: country, loading: countriesLoading } = useSelector((state) => state.countries);
  const [countryData, setActiveCountryData] = useState(null);
  console.log(locationInfo, "locationInfo");
const handleRefresh=()=>{
    dispatch(fetchCountries())

}
  useEffect(() => {
    handleRefresh()
  }, [dispatch]);
  useEffect(() => {
    if (country && country.length > 0 && locationInfo?.country_en) {
      const active = country.find(
        (item) => item.title_en === locationInfo.country_en
      );
      if (active) {
        setActiveCountryData(active);
      }
    }
  }, [country, locationInfo]);
  console.log(country);

  const handleVerify = async () => {

    dispatch(locationData({
      country_ar: countryData?.title_ar,
      country_en: countryData?.title_en,
      currancy: countryData?.currency_en,
      currancy_ar: countryData?.currency_ar,
    }))
    router.replace('/(tabs)')


  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      <CommonHeader
        title={currentLocal.home.country}
        filterState={false}
        currentLocal={currentLocal}

      />
      {/* <Text allowFontScaling={false}style={styles.subTitle}>{currentLocal.home.select_country}</Text> */}
      <FlatList
        data={country}
        keyExtractor={(item) => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 0 : 0, flexGrow: 1,
        }}
        renderItem={({ item }) => {
          return (

            <TouchableOpacity
              style=
              {[styles.itemCartContainer, { flexDirection: currentLocal.language == 'العربيه' ? "row" : "row-reverse" }]}
              onPress={() => {
                setActiveCountryData(item)
              }}
              key={item.id}
            >

              <View style={{ width: 30, height: 30, borderWidth: 1, borderRadius: 15, borderColor: "#555", justifyContent: "center", alignItems: "center" }}>
                {countryData?.title_en == item?.title_en &&
                  <View style={{ width: 24, height: 24, backgroundColor: Colors.light.tint, borderRadius: 12 }}>

                  </View>
                }
              </View>
              <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row" : "row-reverse", alignItems: "center" }}>
                <Text allowFontScaling={false} style={styles.name}>{currentLocal.language == 'العربيه' ? item?.title_ar : item?.title_en}</Text>
                <Image source={{ uri: item?.image }} style={styles.flagImage} />

              </View>

            </TouchableOpacity>

          )
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text allowFontScaling={false} style={styles.emptyText}>{ currentLocal.home.noitems}</Text>
          </View>
        }
        refreshing={countriesLoading}
        refreshControl={
          <RefreshControl
            refreshing={countriesLoading}
            onRefresh={handleRefresh}
            tintColor={"#fff"}
            colors={["#fff"]}
            progressViewOffset={25}
          />
        }

      />
      {/* buttonContaoiner */}
      <>
        <CustomBtn title={currentLocal.home.edit} onPressFun={handleVerify} />
      </>
    </View>
  );

}

export default CountryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,
  },
  image: {
    width: Dimensions.get('screen').width / 3.201,
    height: Dimensions.get('screen').height / 6.71,
    alignSelf: "center",
    resizeMode: "contain"
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "BoldMoto",
    color: Colors.light.tint,
    width: Dimensions.get('screen').width / 2,
    alignSelf: "center"
  },
  subTitle: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "MediumMoto",
    marginTop: 22
  },
  itemContainer: {
    flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap", marginVertical: 22
  },
  itemText: {
    marginTop: 5,
    textAlign: "center",
    fontFamily: "BoldMoto",
  },
  btnContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  name: {
    textAlign: "center",
    fontFamily: "BoldMoto",
    marginHorizontal: 5
  },
  itemCartContainer: {
    flexDirection: "row", justifyContent: "space-between",
    marginBottom: 22,
    alignItems: "center"
  },
  card: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.tint,
    padding: 8
  },
  flagImage: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "BoldMoto"

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
});
