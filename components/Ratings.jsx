import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { useSelector } from 'react-redux';
// import i18n from '@/i18n'; // Your i18n config file

const Ratings = ({ dataItem }) => {
  const { currentLocal } = useSelector((state) => state.Localization);
  const contactList = dataItem?.provider_contacts ?? dataItem?.shop_owner_contacts ?? [];

  const commentList = contactList.filter(item => item?.comment != null && item?.comment !== "");

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <TouchableOpacity


          onPress={() =>
            router.push({
              pathname: '/(routes)/AllCommentAndRate',
              params: {
                items: encodeURIComponent(
                  JSON.stringify(dataItem?.type === "shop_owner"
                    ? dataItem?.shop_owner_contacts
                    : dataItem?.provider_contacts
                  )
                ),
                // items: JSON.stringify(dataItem?.type == "shop_owner" ? dataItem?.shop_owner_contacts:dataItem?.provider_contacts),

              },
            })
          }
        >
          <Text allowFontScaling={false} style={styles.seeMore}>{currentLocal.home.seeMoreText}</Text>

        </TouchableOpacity>
        <Text allowFontScaling={false}
          style={[styles.title, {
            textAlign: currentLocal.language == 'العربيه' ? "right" : "left"
          }]}
        > {currentLocal.home.comments}</Text>


      </View>
      <View>
        {commentList.map((item) => {

          return (
            <>
              <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", alignItems: "center", borderBottomWidth:commentList.length==1?0: 1, borderTopColor: "gray", paddingBottom: 8 }}>
                <View>
                  {item?.image ?
                    <Image source={{ uri: item?.client?.image }} style={{ width: 50, height: 50, resizeMode: "contain", borderRadius: 25 }} />
                    :
                    <View style={[
                      styles.image, {
                        justifyContent: "center",
                        alignItems: "center"
                      }
                    ]}>

                      <FontAwesome name="user" size={60} color="gray" style={{ alignSelf: "center" }} />
                    </View>

                  }
                </View>
                <View style={{ marginHorizontal: 5 }}>
                  <Text allowFontScaling={false} style={styles.name}>{item?.client?.first_name} {item?.client?.last_name}</Text>
                  <View style={styles.itemContainer}>
                    <Text allowFontScaling={false} style={styles.totalRating}>({item?.rate})</Text>

                    <Rating
                      type='star'
                      ratingCount={5}
                      imageSize={18}
                      style={styles.starRating}
                      readonly={true}
                      startingValue={item?.rate}
                    />


                  </View>
                  <Text allowFontScaling={false} style={[styles.category, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}>{item?.comment}</Text>
                </View>
              </View>
            </>
          )
        }
        )}




        {/* : dataItem?.provider_contacts || []?.splice(0, 4).map((item) => {
            return (
              <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", alignItems: "center", borderBottomWidth: 1, borderTopColor: "gray", paddingBottom: 8 }}>
                <View>
                  <Image source={{ uri: item?.client?.image }} style={{ width: 50, height: 50, resizeMode: "contain", borderRadius: 25 }} />
                </View>
                <View style={{ marginHorizontal: 5 }}>
                  <Text allowFontScaling={false} style={styles.name}>{item?.client?.first_name} {item?.client?.last_name}</Text>
                  <View style={styles.itemContainer}>
                    <Text allowFontScaling={false} style={styles.totalRating}>({item?.rate})</Text>

                    <Rating
                      type='star'
                      ratingCount={5}
                      imageSize={18}
                      style={styles.starRating}
                      readonly={true}
                      startingValue={item?.rate}
                    />


                  </View>
                  <Text allowFontScaling={false} style={[styles.category, { textAlign: currentLocal.language == 'العربيه' ? "right" : "left" }]}>{item?.comment}</Text>
                </View>
              </View>
            )


          })
        } */}
      </View>

    </View>
  )
}

export default Ratings

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    borderTopColor: "#ddd",
    borderTopWidth: 5,
    paddingHorizontal: Dimensions.get('screen').width / 28,

  },
  title: {
    marginBottom: 7,
    textAlign: 'left',
    fontSize: 16,
    fontFamily: 'BoldMoto',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 5,
  },

  priceTitle: {
    textAlign: 'left',
    fontFamily: 'BoldMoto',
    fontSize: Dimensions.get('screen').width / 33

  },
  category: {
    textAlign: 'left',
    fontSize: 12,
    fontFamily: 'MediumMoto',
    marginTop: 5
  },
  price: {
    textAlign: 'left',
    fontFamily: 'MediumMoto',
    flexWrap: 'wrap',
    flexShrink: 1,
    fontSize: Dimensions.get('screen').width / 33
  },
  totalRating: {
    fontFamily: 'MediumMoto',
    fontSize: 10,
    color: "#5C5F62"
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'BoldMoto', // Optional font if you're using it
  },
  seeMore: {
    fontFamily: "MediumMoto", textDecorationLine: "underline"

  }
})