import { StyleSheet, Text, View ,FlatList} from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';

const TabsContainer = ({items,renderItem}) => {
      const { currentLocal } = useSelector((state) => state.Localization);

  return (
    <View>
    <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                inverted={currentLocal.language === "العربيه"}
                contentContainerStyle={{
                  paddingVertical: 10,
                  flexGrow: 1, // 👈 force FlatList to measure full width
                  justifyContent: "flex-start",
                }}
              />
    </View>
  )
}

export default TabsContainer

const styles = StyleSheet.create({})