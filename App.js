import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import HomeScreen from './HomeScreen';
import NotificationScreen from './NotificationScreen';

const Stack = createNativeStackNavigator(); // Create a stack navigator

export default function App() {
  return (
    <NavigationContainer>
       <Stack.Navigator>
        <Stack.Screen name='Live Matches' component={HomeScreen} />
        <Stack.Screen name='Notification Screen' component={NotificationScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
