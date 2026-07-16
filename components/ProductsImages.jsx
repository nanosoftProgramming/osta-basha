import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const ProductsImages = ({ dataItem }) => {
  const { width } = Dimensions.get('screen');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeImage = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };
  console.log(dataItem?.image,"dataItem?.image");
  

  const renderImageModal = () => (
    <Modal visible={modalVisible} transparent={true}>
      <Pressable style={styles.modalContainer} onPress={closeImage}>

        <Image source={{ uri: selectedImage }} style={styles.fullImage} />
      </Pressable>
    </Modal>
  );

  if (dataItem?.type === 'service_provider' || dataItem?.type === 'client') {
    return (

      <View style={styles.container}>
        
{dataItem?.image!=null?
        <TouchableOpacity onPress={() => openImage(dataItem?.image)}>

          <Image
            source={{ uri: dataItem?.image }}
            style={{ height: 75, resizeMode: 'contain', marginTop: 12 }}
          />
                        <FontAwesome name="user" size={75} color="gray" style={{ alignSelf: "center" }} />

        </TouchableOpacity>

:
        <View >

                        <FontAwesome name="user" size={75} color="gray" style={{ alignSelf: "center" }} />

        </View>

}
                        {renderImageModal()}

      </View>
    );
  }

  if (dataItem?.type === 'shop_owner') {
    return (
      <View style={styles.container}>
        {dataItem?.shop_images.length!=0?
         <Carousel
          loop
          width={width}
          height={200}
          autoPlay
          data={dataItem?.shop_images}
          scrollAnimationDuration={1000}
          autoPlayInterval={4000}
          renderItem={({ item }) => (
            <Pressable onPress={() => openImage(item.image)}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </Pressable>
          )}
        />
      :
        <View >

                        <FontAwesome name="user" size={75} color="gray" style={{ alignSelf: "center" }} />

        </View>
      }
        {renderImageModal()}
      </View>
    );
  }

  return null;
};

export default ProductsImages;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  image: {
    resizeMode: 'contain',
    width: '92%',
    height: '100%',
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
});
