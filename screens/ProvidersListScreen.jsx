

import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useRef } from 'react'
import CommonHeader from '../components/CommonHeader';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import FilterDrawer from '../components/FilterDrawer';
import UserListContainer from '../components/UserListContainer';

const ProvidersListScreen = () => {
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
          title={currentLocal.home.providers}
          filterState={true}
          ref={headerRef}
          currentLocal={currentLocal}
          filterContent={
            <FilterDrawer
              state={"providers"}
              toggleDrawer={handleSomeAction}
            />
          }
        />

        <UserListContainer
        id={Params?.id}
        type={"service_provider"}

        />
              </View>
    </TouchableWithoutFeedback>
  )
}

export default ProvidersListScreen

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,

  },
})