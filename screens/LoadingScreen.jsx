import { ActivityIndicator, StyleSheet, View } from 'react-native'
import React from 'react'

const LoadingScreen = () => {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  )
}

export default LoadingScreen

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(54, 54, 54, 0.5)", // opacity background
    zIndex: 999
  }
})