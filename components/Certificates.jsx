import { Ionicons } from '@expo/vector-icons'; // Import icon
import { useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSelector } from 'react-redux';

const Certificates = ({ dataItem }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
      const { currentLocal } = useSelector((state) => state.Localization);

  const items = dataItem.certificates !== undefined
    ? dataItem.certificates
    : dataItem.shop_images;

  const openImage = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  const renderImageModal = () => (
    <Modal visible={modalVisible} transparent={true}>
      <View style={styles.modalContainer}>
        <Pressable onPress={closeImage} style={styles.closeButton}>
          <Ionicons name="close" size={30} color="white" />
        </Pressable>
        <Image source={{ uri: selectedImage }} style={styles.fullImage} />
      </View>
    </Modal>
  );

  if (dataItem?.type === 'service_provider') {
    return (
      <View style={styles.container}>
        <Text allowFontScaling={false}style={currentLocal.language == 'العربيه' ?[styles.title,{textAlign:"right"}]:[styles.title,{textAlign:"left"}]}>{currentLocal.home.certificatesText}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', paddingVertical: 10 }}
        >
          {items.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.itemContainer, { marginHorizontal: 7 }]}
              onPress={() => openImage(item?.image)}
            >
              <Image
                source={{ uri: item?.image }}
                style={{
                  width: Dimensions.get('window').width / 3,
                  height: 75,
                  resizeMode: 'contain',
                }}
              />
            </Pressable>
          ))}
        </ScrollView>
        {renderImageModal()}
      </View>
    );
  }

  return null;
};

export default Certificates;

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    borderTopColor: '#ddd',
    borderTopWidth: 5,
    paddingHorizontal: Dimensions.get('screen').width / 28,
  },
  title: {
    marginBottom: 7,
    textAlign: 'left',
    fontSize: 16,
    fontFamily: 'BoldMoto',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
  },
});
