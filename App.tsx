import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CheckInScreen} from './src/screens/CheckInScreen';
import {HistoryScreen} from './src/screens/HistoryScreen';
import {InsightsScreen} from './src/screens/InsightsScreen';
import {SettingsScreen} from './src/screens/SettingsScreen';
import {NotificationService} from './src/services/notifications';

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    NotificationService.initialize();
    NotificationService.updateFromSettings();
    NotificationService.requestPermissions();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6C63FF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarActiveTintColor: '#6C63FF',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
        }}>
        <Tab.Screen
          name="Check In"
          component={CheckInScreen}
          options={{
            tabBarLabel: 'Check In',
            tabBarIcon: ({color}) => <TabIcon icon="✏️" color={color} />,
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarLabel: 'History',
            tabBarIcon: ({color}) => <TabIcon icon="📊" color={color} />,
          }}
        />
        <Tab.Screen
          name="Insights"
          component={InsightsScreen}
          options={{
            tabBarLabel: 'Insights',
            tabBarIcon: ({color}) => <TabIcon icon="💡" color={color} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({color}) => <TabIcon icon="⚙️" color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const TabIcon = ({icon, color}: {icon: string; color: string}) => {
  return <span style={{fontSize: 24, opacity: color === '#6C63FF' ? 1 : 0.5}}>{icon}</span>;
};

export default App;
