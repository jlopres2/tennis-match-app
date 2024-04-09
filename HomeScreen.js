import { StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* <Button
        title="Home"
        onPress={() => navigation.navigate('Home')}
      /> */}
      <Button
        title="Find matches"
        onPress={() => navigation.navigate('Search')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
