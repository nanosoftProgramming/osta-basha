import { Alert, Dimensions, FlatList, Image, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChangeLanguageContainer from '../components/ChangeLanguageContainer';
import ChooseCountryContainer from '../components/ChooseCountryContainer';
import { useDispatch, useSelector } from 'react-redux';
import CustomBtn from '../components/CustomBtn';
import { fetchCountries } from '../hooks/Countries';
import LoadingScreen from './LoadingScreen';
import { router } from 'expo-router';

const CountriesScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { currentLocal } = useSelector((state) => state.Localization);
  const { list: countries, loading: countriesLoading } = useSelector((state) => state.countries);
  const locationInfo = useSelector((state) => state.location);
  const [loading, setLoading] = useState(false)
  const handleRefresh=()=>{
    dispatch(fetchCountries())

  }
  // useEffect(() => {
  //   handleRefresh()
  // }, [dispatch])


  const handleVerify = () => {
    setLoading(true)

    if (!locationInfo?.country_en) {
      Alert.alert("error", currentLocal.home.select_country);
      setLoading(false)

    } else {
      router.push({params:"(routes)/Login",params:{previousScreen: '(routes)/Countries',}})
      setLoading(false)

    }
  };

    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
            <FlatList
            data={[{id:1}]}
            keyExtractor={(item) => item?.id?.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 0 : 0, flexGrow: 1,
            }}
            renderItem={({ item }) => {
              return (

          <>
                    {/* logo container */}

          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/logo-removebg-preview.png')} style={styles.image} />
          </View>
          {/* chnageLang */}
          <>
            <ChangeLanguageContainer
              title={""}
            />
          </>


          {/* chooseCountry */}
          <>
            <ChooseCountryContainer
              countries={countries}
            />

          </>
          </>
              )
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text allowFontScaling={false} style={styles.emptyText}>{currentLocal.home.noitems}</Text>
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
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        </ScrollView>
        <>
          <CustomBtn title={currentLocal.home.next} onPressFun={handleVerify} loading={loading} disabled={loading} />
        </>
      </View>
    )
}

export default CountriesScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 16,

  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('screen').width / 3,
    height: Dimensions.get('screen').height / 6,
    alignSelf: "center",
    resizeMode: "contain",
    borderRadius: 200, margin: 11
  },
})