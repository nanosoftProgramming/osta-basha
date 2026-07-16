import { router } from 'expo-router';
import { Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import CardContainer from './CardContainer';
import SkiltonContainer from './SkiltonContainer';

const Providers = ({ items,loading }) => {
  const { currentLocal } = useSelector((state) => state.Localization);

const renderSkeleton = () => (
    <View style={{ paddingHorizontal: 10 }}>
      <View style={{ width: Dimensions.get('window').width - 20, height: 20, borderRadius: 10, backgroundColor: '#E0E0E0' }} />
      {[1, 2].map((i) => (
        <View style={styles.card}>
          {/* Image placeholder */}

          <View style={{ width: Dimensions.get('window').width - 20, height: Dimensions.get('window').height / 6, marginTop: 5, backgroundColor: '#E0E0E0', borderRadius: 5 }} />

        </View>
      ))}
</View>
);
  return (
    <View style={styles.container}>
      {loading ? (
    <SkiltonContainer
    loading={loading}
    data={renderSkeleton()}
    />

      ) : (
<>     
 <View style={{ flexDirection: currentLocal.language == 'العربيه' ? "row-reverse" : "row", justifyContent: "space-between", marginTop: 32 }}>
        <Text allowFontScaling={false} style={styles.title}>{currentLocal.home.featuredServicesTitle}</Text>
        <TouchableOpacity


          onPress={() =>
            router.push({
              pathname: '/(routes)/ProvidersList',
              params: { state: 'providers',
                items: JSON.stringify(items)
               },
            })
          }
        >
          <Text allowFontScaling={false} style={styles.seeMore}>{currentLocal.home.seeMoreText}</Text>

        </TouchableOpacity>

      </View>
      <FlatList
        data={items.filter((item) => item.type === "service_provider").slice(0, 3)}
        keyExtractor={(item) => item?.id?.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 100 : 20 }}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <CardContainer item={item} />
          </View>
        )}
      />
      </>
      )}
    </View>
  )
}

export default Providers

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Dimensions.get('screen').width / 28,


  },
  title: {
    textAlign: "right",
    fontFamily: "BoldMoto",
    fontSize: 16,
    marginBottom: 12
  },
  itemsContainer: {

    paddingHorizontal: 1

  },
  itemContainer: {
  },
  seeMore: {
    fontFamily: "MediumMoto", textDecorationLine: "underline"

  }
})