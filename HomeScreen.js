import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('https://api.sportradar.com/tennis/trial/v3/en/schedules/live/summaries.json?api_key=61L6LUghNb8h1dABHxJc7602f0yMnC2a8PHFtJhW');
      const data = await response.json();
      // Extracting relevant information from the API response
      const extractedMatches = data.summaries.map(summary => ({
        player1: summary.sport_event.competitors[0].name,
        player2: summary.sport_event.competitors[1].name,
        competitionName: summary.sport_event.sport_event_context.competition.name,
        competitionLevel: summary.sport_event.sport_event_context.competition.level,
        score: summary.sport_event_status.match_status,
      }));
      setMatches(extractedMatches);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.matchContainer}>
      <Text style={styles.matchText}>{item.player1} vs {item.player2}</Text>
      <Text style={styles.matchText}>Competition: {item.competitionName}</Text>
      <Text style={styles.matchText}>Level: {item.competitionLevel}</Text>
      <Text style={styles.matchText}>Score: {item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title="Search player info"
        onPress={() => navigation.navigate('Search')}
      />
      <FlatList
        data={matches}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  matchContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  matchText: {
    fontSize: 16,
  },
});

export default HomeScreen;























// import { StyleSheet, Text, View, Button} from 'react-native';
// import React from 'react';

// const HomeScreen = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       {/* <Button
//         title="Home"
//         onPress={() => navigation.navigate('Home')}
//       /> */}
//       <Button
//         title="Find matches"
//         onPress={() => navigation.navigate('Search')}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default HomeScreen;
