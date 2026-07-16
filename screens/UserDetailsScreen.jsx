
import axios from 'axios'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Dimensions, FlatList, Platform, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import Certificates from '../components/Certificates'
import CommonHeader from '../components/CommonHeader'
import ContactBox from '../components/ContactBox'
import Info from '../components/Info'
import ProductsImages from '../components/ProductsImages'
import ProviderSubCategories from '../components/ProviderSubCategories'
import Ratings from '../components/Ratings'
import RelatedUsers from '../components/RelatedUsers'
import SkiltonContainer from '../components/SkiltonContainer'

const UserDetailsScreen = () => {
  const { currentLocal } = useSelector((state) => state.Localization);
  const insets = useSafeAreaInsets();

  const Params = useLocalSearchParams();
  const marker = Params.marker
  const dataItem = JSON.parse(marker || '{}');
  const userinfo = useSelector((state) => state.authorization);
  const [userList, setUserList] = useState([]);
  const [subcategories, setSubcategories] = useState(null);
const [loading, setLoading] = useState(true);
  const handleSubCategorySelect = (id) => {
    setSubcategories(id)
  }
  useEffect(() => {
setTimeout(() => {
  setLoading(false)
}, 1000);
    const getData = async () => {

      const token = userinfo.token;
      try {
        const res = await axios.get(`https://nanosoft.technology/osta-basha/api/related-providers/${dataItem?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data.data.data, "res.data.data.data");

        setUserList(res.data.data.data)
      } catch (error) {

      }
    };
    getData();
  }, []);
const renderSkeleton = () => (
  <View style={{ paddingHorizontal: 10 }}>
    {/* Images */}
    <SkiltonContainer
      loading={true}
      data={
        <View
          style={{
            width: '100%',
            height: 220,
            borderRadius: 10,
            backgroundColor: '#E0E0E0',
          }}
        />
      }
    />

    {/* Info */}
    <View style={{ marginTop: 15 }}>
      <SkiltonContainer
        loading={true}
        data={
          <View
            style={{
              width: '70%',
              height: 20,
              backgroundColor: '#E0E0E0',
              borderRadius: 5,
            }}
          />
        }
      />

      <View
        style={{
          width: '90%',
          height: 15,
          backgroundColor: '#E0E0E0',
          borderRadius: 5,
          marginTop: 10,
        }}
      />

      <View
        style={{
          width: '60%',
          height: 15,
          backgroundColor: '#E0E0E0',
          borderRadius: 5,
          marginTop: 10,
        }}
      />
    </View>
  </View>
);
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, }]}>
            <CommonHeader
        title={dataItem?.type === "service_provider" ? currentLocal.home.craftsman : currentLocal.home.shopOwner}
        filterState={false}
        currentLocal={currentLocal}
        wishList={true}
        item={dataItem}
      />
{loading?
<>
    <SkiltonContainer
    loading={loading}
    data={renderSkeleton()}
    /></>
:
<>

      <FlatList
        data={[{ id: dataItem?.id || 1 }]}
        keyExtractor={(item, index) => index?.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 20 : 20 }}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={{
              paddingHorizontal: Dimensions.get('screen').width / 28,
            }}>


            </View>
            <ProductsImages dataItem={dataItem} />
            <Info dataItem={dataItem} />
            <ProviderSubCategories
              dataItem={dataItem}
              onSelectSubCategory={handleSubCategorySelect}
            />
            {dataItem?.certificates?.length != 0 &&
              <Certificates dataItem={dataItem} />
            }

            <View>
              {dataItem?.provider_contacts?.length !== 0 || dataItem?.provider_contacts != undefined &&
                <Ratings
                  dataItem={dataItem}
                />

              }
            </View>
            {userList.length !== 0 &&
              <RelatedUsers
                items={userList}
              />
            }

          </View>
        )}

        
      />

      <ContactBox dataItem={dataItem} subcategories={subcategories} />

</>
}

    </View>
  )
}

export default UserDetailsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,
  },


})