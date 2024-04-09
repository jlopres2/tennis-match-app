import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const SearchScreen = ({ navigation }) => {


  return (
    <View style={styles.container}>
      {/* <Button
        title="Home"
        onPress={() => navigation.navigate('Home')}
      />
      <Button
        title="Search"
        onPress={() => navigation.navigate('Search')}
      /> */}
    </View>
  );
};

// const options = {method: 'GET', headers: {accept: 'application/json'}};

// fetch('https://api.sportradar.com/tennis/trial/v3/en/schedules/live/summaries.json?api_key=61L6LUghNb8h1dABHxJc7602f0yMnC2a8PHFtJhW', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchScreen;
