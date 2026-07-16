import { Colors } from '@/constants/theme'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { Dimensions, FlatList, Image, Platform, RefreshControl, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import CardContainer from '../components/CardContainer'
import CustomBtn from '../components/CustomBtn'
import LoadingScreen from './LoadingScreen'
import { fetchWishlist } from "../hooks/wishList"
import SkiltonContainer from '../components/SkiltonContainer'
const WishlistScreen = () => {
  const { currentLocal } = useSelector((state) => state.Localization);
  const {list:data,loading:isLoading} = useSelector((state) => state.wishlist)
  const userinfo = useSelector((state) => state.authorization);
  const dispatch = useDispatch();
  
  const fetchData=()=>{
    dispatch(fetchWishlist())

  }
  useEffect(() => {
    fetchData()
  }, [dispatch])
  if(userinfo?.token){
  return (
    <TouchableWithoutFeedback>

      <View style={styles.container}>
      <Text allowFontScaling={false} style={currentLocal.language == 'العربيه' ? [styles.title, { textAlign: "right" }] : [styles.title, { textAlign: "left" }]}>{currentLocal.home.wishlist}</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 0 : 0, flexGrow: 1,
        }}
        renderItem={({ item }) => {
          console.log(item);
          
          return (

            <View style={styles.itemContainer}>
              {isLoading?
<>
                <View style={{height: 100,width: "100%",backgroundColor: "#f0f0f0",borderRadius: 8,marginVertical: 8}}/>
                <View style={{height: 100,width: "100%",backgroundColor: "#f0f0f0",borderRadius: 8,marginVertical: 8}}/>
                <View style={{height: 100,width: "100%",backgroundColor: "#f0f0f0",borderRadius: 8,marginVertical: 8}}/>
                <View style={{height: 100,width: "100%",backgroundColor: "#f0f0f0",borderRadius: 8,marginVertical: 8}}/>

</>              :
              <CardContainer item={item?.user}
              favState={true} />
        }
            </View>
          )
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text allowFontScaling={false} style={styles.emptyText}>{currentLocal.home.noitems}</Text>
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
  
    </TouchableWithoutFeedback>
  )
}else{
  return(
      <View style={styles.container}>
<View style={styles.unauthcontainer}>
  <View style={styles.btnContainer}>
    <Image source={require("../assets/images/emptywishlist.jpg")}style={styles.image}/>
          <CustomBtn title={currentLocal.home.login} onPressFun={()=>router.push({pathname:"(routes)/Login",params:{previousScreen:"(tabs)/wishlist"}})}   />

  </View>
</View>
    </View>
  )
}
}

export default WishlistScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Dimensions.get('screen').height / 20,
    paddingBottom: Dimensions.get('screen').height / 15,
    paddingHorizontal: Dimensions.get('screen').width / 28,

  },
  subCategoryContainer: {
    borderWidth: 1,
    borderColor: "#ededed",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  activeSbCategoryContainer: {
    borderWidth: 2,
    borderColor: Colors?.light?.tint,
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'BoldMoto',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'MediumMoto',
    color: '#686868ff',
    textAlign: "center"
  },

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
title:{
      fontSize: 16,
    fontFamily: 'BoldMoto',
    marginTop: 14,
    textAlign: "left",
    marginBottom: 22,
},
unauthcontainer:{
justifyContent:"center",
alignItems:"center",
flex:1,
},
btnContainer:{
  width: "85%",
  marginVertical:22
},
image:{
  width: "100%",
  height: "75%",
}
});
