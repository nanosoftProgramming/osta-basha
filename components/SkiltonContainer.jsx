import { Skeleton } from 'moti/skeleton';
import { View, StyleSheet } from 'react-native';

const SkiltonContainer = ({ loading, data }) => {
  // Create an array to show 4-5 skeleton items while loading

  return (
    <Skeleton.Group visible={loading}>
      <View style={styles.row}>
  {data}
      </View>
    </Skeleton.Group>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'center',
  },
  itemContainer: {
    marginHorizontal: 7,
    alignItems: 'center',
  },
});

export default SkiltonContainer;