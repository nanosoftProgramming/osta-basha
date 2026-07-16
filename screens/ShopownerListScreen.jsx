import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useRef } from 'react'
import CommonHeader from '../components/CommonHeader';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import FilterDrawer from '../components/FilterDrawer';
import UserListContainer from '../components/UserListContainer';

const ShopownerListScreen = () => {
      const headerRef = useRef(null);
    const Params = useLocalSearchParams();
  const { currentLocal } = useSelector((state) => state.Localization);


      const handleSomeAction = () => {
    headerRef.current?.toggleDrawer();
  };
  return (
<TouchableWithoutFeedback>
    <View style={styles.container}>

        <CommonHeader
          title={currentLocal.home.shopOwner}
          filterState={true}
          ref={headerRef}
          currentLocal={currentLocal}
          filterContent={
            <FilterDrawer
              state={"shop-owners"}
              toggleDrawer={handleSomeAction}
            />
          }
        />

        <UserListContainer
        id={Params?.id}
        type={"shop_owner"}

        />
              </View>
    </TouchableWithoutFeedback>
  )
}

export default ShopownerListScreen

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,

  },
})
