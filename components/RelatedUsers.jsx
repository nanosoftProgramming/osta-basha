import { Dimensions, FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import CardContainer from './CardContainer';

const RelatedUsers = ({ items }) => {
  const { currentLocal } = useSelector((state) => state.Localization);

  return (
    <View style={{
      marginHorizontal: Dimensions.get('screen').width / 28, marginTop: 22, borderTopColor: '#ddd',
      borderTopWidth: 5, paddingTop: 22

    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text allowFontScaling={false}style={[styles.title,{
          textAlign:currentLocal.language == 'العربيه' ? "right":"left"
        }]}>{currentLocal.home.similarItemsTitle}</Text>

      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 100 : 20 }}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <CardContainer item={item} />
          </View>
        )}
      />   
       </View>
  )
}

export default RelatedUsers

const styles = StyleSheet.create({
  title: {
    textAlign: "right",
    fontFamily: "BoldMoto",
    fontSize: 16,
    marginBottom: 12,
    width: "100%",
  },
})