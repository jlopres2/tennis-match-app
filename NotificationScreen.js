
import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationScreen = ({ navigation }) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    // Call function that calls API

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 100,
      }}>
      <Button
        title="Press to get match point updates"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

//if there was a way to make this method also call onto homescreen fetch matches
// so that home screen also updates, that would be great
async function fetchMatchesFromAPI() { 
  try {
    const response = await fetch('https://api.sportradar.com/tennis/trial/v3/en/schedules/live/summaries.json?api_key=61L6LUghNb8h1dABHxJc7602f0yMnC2a8PHFtJhW');
    const data = await response.json();
    const extractedMatches = data.summaries
   // .filter(summary => summary.sport_event_status.status == "live" && summary.sport_event_status.match_status !== "match_about_to_start")
    .filter(summary => 
      summary.sport_event_status.status == 'live' &&
      summary.sport_event_status.match_status !== 'match_about_to_start' &&
      summary.sport_event_status.game_state && // ensures game_state exists before accessing its properties
      summary.sport_event_status.game_state.point_type == 'game' //its rare that it is a match point, but if it is this will notify if you put 'match' instead of game, using game for testing
    )
    .map(summary => ({
      player1: summary.sport_event.competitors[0].name,
      player2: summary.sport_event.competitors[1].name,
      competitionName: summary.sport_event.sport_event_context.competition.name,
      competitionLevel: summary.sport_event.sport_event_context.competition.level,
      matchStatus: summary.sport_event_status.match_status,
      p1Score: summary.sport_event_status.home_score,
      p2Score: summary.sport_event_status.away_score,
      pointType: summary.sport_event_status.game_state.point_type,
    }));
    return extractedMatches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  }

async function schedulePushNotification(){
  const matches = await fetchMatchesFromAPI();
    matches.forEach(async match => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Match Notification",
          body: `${match.player1} vs ${match.player2}\n ${match.p1Score} - ${match.p2Score}\n ${match.pointType}\n ${match.competitionName}`,

        },
        trigger: { seconds: 2 },
      });
    });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }


  return token;
}

export default NotificationScreen;
