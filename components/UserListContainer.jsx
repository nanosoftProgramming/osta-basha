import { Colors } from '@/constants/theme';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Platform, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CardContainer from '../components/CardContainer';
import { filterData } from '../hooks/filterationReducer';
import { fetchUsers } from '../hooks/users';
import SkiltonContainer from './SkiltonContainer';
import Seemore from '../screens/Seemore';

const UserListContainer = ({ id,type ,usersData}) => {
  const dispatch = useDispatch();
  const Params = useLocalSearchParams();
  const { currentLocal } = useSelector((state) => state.Localization);
    const { list: users, loading: usersLoading, pagination } = useSelector((state) => state?.users);
  const [page, setPage] = useState(1);
  const locationInfo = useSelector((state) => state.location);
  const { filter } = useSelector((state) => state.filterReducer);
    const [allUsers, setAllUsers] = useState([]);
const displayList = usersData && usersData.length > 0 ? usersData : allUsers;

  const getUsersByCatgeory = (page = 1) => {
    if(type){
    dispatch(fetchUsers({
      page: page,
      paginated: 1,
      country: locationInfo?.country_en,
      ...(filter?.[0]?.category_id && { category_id: filter[0].category_id }),
      ...(filter?.[0]?.subcategorry_id && { sub_category_id: filter[0].subcategorry_id }),
      ...(filter?.[0]?.experience && { experience_years: filter[0].experience }),
      ...(filter?.[0]?.price && { max_price: filter[0].price }),
      ...(type && { type: type })


    }))
    }else{
    dispatch(fetchUsers({
      page: page,
      paginated: 1,
      country: locationInfo?.country_en,
      ...(filter?.[0]?.category_id && { category_id: filter[0].category_id }),
      ...(filter?.[0]?.subcategorry_id && { sub_category_id: filter[0].subcategorry_id }),
      ...(filter?.[0]?.experience && { experience_years: filter[0].experience }),
      ...(filter?.[0]?.price && { max_price: filter[0].price }),



    }))
    }

  }
// to save data afetr loading

useEffect(() => {
    // إذا كانت البيانات تأتي من الأب، فلا داعي لعمل setAllUsers بناءً على الـ Store
    if (!usersData) {
      if (users) {
        if (page === 1) {
          setAllUsers(users);
        } else {
          setAllUsers((prev) => [...prev, ...users.filter(item => !prev.find(p => p.id === item.id))]);
        }
      }
    } else {
      // إذا كانت البيانات تأتي من الأب، نضعها مباشرة
      setAllUsers(usersData);
    }
  }, [users, usersData, page]);


useEffect(() => {
    setPage(1); // Reset page to 1 when filter changes
    getUsersByCatgeory(1);
  }, [filter]);


  const handleRefresh = () => {
    setPage(1);
    setAllUsers([]);
    getUsersByCatgeory(1);
  };
  const handleLoadMore = () => {

    const nextPage = page + 1;

    setPage(nextPage);
    const data = {
      page: nextPage,
      paginated: 1,
    };
if(type){
    dispatch(fetchUsers({
      ...data,
      country: locationInfo?.country_en,
      ...(filter?.[0]?.category_id && { category_id: filter[0].category_id }),
      ...(filter?.[0]?.subcategorry_id && { sub_category_id: filter[0].subcategorry_id }),
      ...(filter?.[0]?.experience && { experience_years: filter[0].experience }),
      ...(filter?.[0]?.price && { max_price: filter[0].price }),
      ...(type && { type: type })
    }));
}else{
    dispatch(fetchUsers({
      ...data,
      country: locationInfo?.country_en,
      ...(filter?.[0]?.category_id && { category_id: filter[0].category_id }),
      ...(filter?.[0]?.subcategorry_id && { sub_category_id: filter[0].subcategorry_id }),
      ...(filter?.[0]?.experience && { experience_years: filter[0].experience }),
      ...(filter?.[0]?.price && { max_price: filter[0].price }),
    }));
}


  };
  const renderSkeletonList = () => (
    <View style={{ paddingHorizontal: 10 }}>
      <View style={{ width: Dimensions.get('window').width - 20, height: 20, borderRadius: 10, backgroundColor: '#E0E0E0' }} />

      {[1, 2, 3, 4].map((i) => (
        <View style={styles.card}>
          {/* Image placeholder */}

          <View style={{ width: Dimensions.get('window').width - 20, height: Dimensions.get('window').height / 6, marginTop: 5, backgroundColor: '#E0E0E0', borderRadius: 5 }} />

        </View>
      ))}
    </View>
  );
  return (
    <View style={{ flex: 1, paddingHorizontal: 10, marginTop: 10 }}>
      {usersLoading ?
        <SkiltonContainer
          loading={!usersLoading}
          data={renderSkeletonList()}
        /> :
        <>
          <Text allowFontScaling={false} style={currentLocal.language == "English" ? styles.enTitle : styles.arTitle}>{currentLocal.home.Users} ({allUsers?.length})</Text>
          <FlatList
            data={allUsers}
            keyExtractor={(item) => item?.id?.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Platform.OS === "ios" ? 0 : 0, flexGrow: 1,
            }}
            renderItem={({ item }) => {
              return (

                <View style={styles.itemContainer}>
                  <CardContainer item={item} />
                </View>
              )
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text allowFontScaling={false} style={styles.emptyText}>{Params?.state === "contact" ? currentLocal.home.notaddedanyProviders : currentLocal.home.noitems}</Text>
              </View>
            }
            refreshing={usersLoading}
            refreshControl={
              <RefreshControl
                refreshing={usersLoading}
                onRefresh={handleRefresh}
                tintColor={Colors.light.tint}
                colors={[Colors.light.tint]}
                progressViewOffset={25}
              />
            }

          />
  {allUsers.length < Number(pagination?.meta?.total) && (
  <Seemore
    onPressFun={handleLoadMore}
  />
)}
        </>
      }



    </View>
  )
}

export default UserListContainer

const styles = StyleSheet.create({
  enTitle: {
    fontFamily: 'MediumMoto',
    color: '#686868ff',
    textAlign: "left", marginVertical: 12,
    fontSize: 16
  },
  arTitle: {
    fontFamily: 'MediumMoto',
    color: '#686868ff',
    textAlign: "right",
    marginVertical: 12,
    fontSize: 16

  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'MediumMoto',
    color: '#686868ff',
    textAlign: "center"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 7,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  details: {
    marginLeft: 10,
    gap: 10,
    flex: 1,
  }
})