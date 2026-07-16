import { useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useSelector } from 'react-redux';
import CommonHeader from '../components/CommonHeader';
import FilterDrawer from '../components/FilterDrawer';
import SubcategoriesContainer from '../components/SubcategoriesContainer';
import UserListContainer from '../components/UserListContainer';

const UsersListScreen = () => {
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
          title={Params?.title}
          filterState={true}
          ref={headerRef}
          currentLocal={currentLocal}
          filterContent={
            <FilterDrawer
              state={"categories"}
              id={Params?.id}
              toggleDrawer={handleSomeAction}
            />
          }
        />
        <SubcategoriesContainer
        id={Params}
        />
        <UserListContainer
        id={Params?.id}

        />

        </View>
    </TouchableWithoutFeedback>
  )
}

export default UsersListScreen

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 28,
    paddingHorizontal: 12,

  },
})