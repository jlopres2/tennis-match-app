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
      const extractedMatches = data.summaries
      .filter(summary => summary.sport_event_status.status == 'live' && summary.sport_event_status.match_status !== 'match_about_to_start')
      .map(summary => ({
        matchStatus: summary.sport_event_status.match_status,
        liveStatus: summary.sport_event_status.status,
        player1: summary.sport_event.competitors[0].name,
        player2: summary.sport_event.competitors[1].name,
        competitionName: summary.sport_event.sport_event_context.competition.name,
        p1Score: summary.sport_event_status.home_score,
        p2Score: summary.sport_event_status.away_score,
      
        // i think this line will sometimes lead to errors if the data has no pointType
        pointType: summary.sport_event_status.game_state.point_type,
      }));
      setMatches(extractedMatches);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.matchContainer}>
      <Text style={styles.matchText}>{item.player1} vs {item.player2}</Text>
      <Text style={styles.matchText}>Score: {item.p1Score} - {item.p2Score}</Text>
      <Text style={styles.matchText}>Point type: {item.pointType}</Text>
      <Text style={styles.matchText}>Competition: {item.competitionName}</Text>
      <Text style={styles.matchText}>Match Status: {item.matchStatus}</Text>
      <Text style={styles.matchText}>Status: {item.liveStatus}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title="Notification page"
        onPress={() => navigation.navigate('Notification Screen')}
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
