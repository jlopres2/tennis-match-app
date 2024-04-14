
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
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}


async function fetchMatchesFromAPI() {
  try {
    const response = await fetch('https://api.sportradar.com/tennis/trial/v3/en/schedules/live/summaries.json?api_key=61L6LUghNb8h1dABHxJc7602f0yMnC2a8PHFtJhW');
    const data = await response.json();
    const extractedMatches = data.summaries.map(summary => ({
      player1: summary.sport_event.competitors[0].name,
      player2: summary.sport_event.competitors[1].name,
      competitionName: summary.sport_event.sport_event_context.competition.name,
      gameStatus: summary.sport_event_status.status,
      gameState: summary.sport_event_status.match_status,
    }));
    return extractedMatches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
  }

async function schedulePushNotification() {
  const matches = await fetchMatchesFromAPI();
    matches.forEach(async match => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Match Notification",
          body: `${match.player1} vs ${match.player2} - ${match.competitionName}`,
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

  // if (Device.isDevice) {
  //   const { status: existingStatus } = await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;
  //   if (existingStatus !== 'granted') {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }
  //   if (finalStatus !== 'granted') {
  //     alert('Failed to get push token for push notification!');
  //     return;
  //   }
  //   // Learn more about projectId:
  //   // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
  //   token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
  //   console.log(token);
  // } else {
  //   alert('Must use physical device for Push Notifications');
  // }

  return token;
}

export default NotificationScreen;









// import { useState, useEffect, useRef } from 'react';
// import { Text, View, Button, Platform } from 'react-native';

// import * as Notifications from 'expo-notifications';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export default function App() {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const [notification, setNotification] = useState(false);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   useEffect(() => {
//     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log(response);
//     });

//     // Call function that calls API

//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener.current);
//       Notifications.removeNotificationSubscription(responseListener.current);
//     };
//   }, []);

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'space-around',
//       }}>
//       <Text>Your expo push token: {expoPushToken}</Text>
//       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Title: {notification && notification.request.content.title} </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//       </View>
//       <Button
//         title="Press to schedule a notification"
//         onPress={async () => {
//           await schedulePushNotification();
//         }}
//       />
//     </View>
//   );
// }

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: " Match Point",
//       body: 'Here is the notification body',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   // if (Device.isDevice) {
//   //   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   //   let finalStatus = existingStatus;
//   //   if (existingStatus !== 'granted') {
//   //     const { status } = await Notifications.requestPermissionsAsync();
//   //     finalStatus = status;
//   //   }
//   //   if (finalStatus !== 'granted') {
//   //     alert('Failed to get push token for push notification!');
//   //     return;
//   //   }
//   //   // Learn more about projectId:
//   //   // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
//   //   token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
//   //   console.log(token);
//   // } else {
//   //   alert('Must use physical device for Push Notifications');
//   // }

//   return token;
// }





// import React from 'react';
// import { View, Button, StyleSheet } from 'react-native';

// const SearchScreen = ({ navigation }) => {


//   return (
//     <View style={styles.container}>
//       {/* <Button
//         title="Home"
//         onPress={() => navigation.navigate('Home')}
//       />
//       <Button
//         title="Search"
//         onPress={() => navigation.navigate('Search')}
//       /> */}
//     </View>
//   );
// };

// // const options = {method: 'GET', headers: {accept: 'application/json'}};

// // fetch('https://api.sportradar.com/tennis/trial/v3/en/schedules/live/summaries.json?api_key=61L6LUghNb8h1dABHxJc7602f0yMnC2a8PHFtJhW', options)
// //   .then(response => response.json())
// //   .then(response => console.log(response))
// //   .catch(err => console.error(err));

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default SearchScreen;
