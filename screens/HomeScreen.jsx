import { Colors } from '@/constants/theme'
import { useEffect } from 'react'
import { Dimensions, FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import HomeHeader from '../components/HomeHeader'
import Providers from '../components/Providers'
import SearchContainer from '../components/SearchContainer'
import Services from '../components/Services'
import ShopsOwners from '../components/ShopsOwners'
import { fetchCategories } from '../hooks/categoriesReducer'
import { fetchProviders } from '../hooks/providers'
import { fetchShopsowners } from '../hooks/shopsowners'
import { fetchWishlist } from '../hooks/wishList'

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()
  const datat = useSelector((state) => state);
  const { list: categories, loading: categoriesLoading } = useSelector((state) => state?.categories);
  const { list: shopowners, loading: shopownersLoading } = useSelector((state) => state?.shopsowners);
  const { list: providers, loading: providersLoading } = useSelector((state) => state?.providers);
  const locationInfo = useSelector((state) => state.location);
  const isLoading = categoriesLoading || shopownersLoading || providersLoading;
  const fetchData = () => {

    const data = {
      page: 1,
      paginated: 2,
      country: locationInfo?.country_en,
      
    }

    dispatch(fetchCategories())
    dispatch(fetchWishlist())

if(locationInfo?.country_en){
    dispatch(fetchShopsowners(data))
    dispatch(fetchProviders(data))

  }
}
  useEffect(() => {
    fetchData()
  }, [dispatch, locationInfo?.country_en])

  return (
    <View style={styles.container}>
      <HomeHeader sliders={"sliders"} />
      <FlatList
        contentContainerStyle={{
          paddingBottom: insets.bottom + 10,
        }}

        ListHeaderComponent={
          <>

            <SearchContainer />
            {categories && categories.length !== 0 &&

              <Services items={categories} loading={categoriesLoading} />
            }
            {shopowners && shopowners.length !== 0 &&
              <ShopsOwners items={shopowners.filter((item)=> item.first_name !== null && item.first_name.toString().trim() !== "")} loading={shopownersLoading} />
            }
            {providers && providers.length !== 0 &&

              <Providers items={providers.filter((item)=> item.first_name !== null && item.first_name.toString().trim() !== "")} loading={providersLoading} />
            }

          </>
        }
        data={[]}
        renderItem={null}
        showsVerticalScrollIndicator={false}
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
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  headerContainer: {
    height: Dimensions.get('screen').height / 3.576,
    backgroundColor: Colors.light.tint,
    borderBottomRightRadius: 25,
    marginHorizontal: 22,
    borderBottomLeftRadius: 25,

  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

  },
  item: {
    width: "49%"
  },
  image: {
    resizeMode: "contain",
    width: "100%",
    height: "83%"
  }
})