import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/theme';
const AccountImage = ({imageValue}) => {
    const handleImagePick = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      // Resize the image (e.g., to 800px width while maintaining aspect ratio)
      const resized = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 500 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setFormData(prev => ({
        ...prev,
        [field]: { uri: resized.uri },
      }));
    }
  };
  return (
              <TouchableOpacity style={styles.imageContainer} onPress={() => handleImagePick('profile_image')}>
                <Image
                  source={imageValue ? { uri: imageValue.uri } : require("../assets/images/Rectangle 5621.png")}
                  style={styles.profileImage}
                />
                <View style={styles.cameraIcon}>
                  <Text allowFontScaling={false} style={styles.cameraText}>📷</Text>
                </View>
              </TouchableOpacity>  )
}

export default AccountImage

const styles = StyleSheet.create({
    imageContainer: {
    alignSelf: "center",
    position: "relative",
    marginVertical: 20,
  },
  
    profileImage: {
      borderRadius: 12,
      marginBottom: 7,
      width: 100,
      height: 110,
      marginStart: 5
    },
      cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    padding: 5,
  },
  cameraText: {
    fontSize: 14,
    color: "#fff",
  },
})