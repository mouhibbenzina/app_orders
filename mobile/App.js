import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { connectSocket, disconnectSocket } from './src/api/socket';
import LoginScreen from './src/screens/LoginScreen';
import AgentHomeScreen from './src/screens/AgentHomeScreen';
import NewRequestScreen from './src/screens/NewRequestScreen';
import DGHomeScreen from './src/screens/DGHomeScreen';
import GuardHomeScreen from './src/screens/GuardHomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import RequestDetailScreen from './src/screens/RequestDetailScreen';
import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      connectSocket(user.role);
    }
    return () => disconnectSocket();
  }, [user]);

  if (!user) return null;

  const screens = {
    agent: AgentHomeScreen,
    dg: DGHomeScreen,
    garde: GuardHomeScreen,
    admin: HistoryScreen,
  };

  const HomeComponent = screens[user.role] || AgentHomeScreen;

  const titleMap = {
    agent: 'Agent d\'accueil',
    dg: 'Directeur Général',
    garde: 'Équipe de garde',
    admin: 'Administrateur',
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a73e8' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeComponent}
        options={{
          title: titleMap[user.role] || 'Accueil',
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ marginRight: 8 }}>
              <Text style={{ color: '#fff', fontSize: 14 }}>Déconnexion</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="NewRequest" component={NewRequestScreen} options={{ title: 'Nouvelle demande' }} />
      <Stack.Screen name="RequestDetail" component={RequestDetailScreen} options={{ title: 'Détail demande' }} />
    </Stack.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#1a73e8" />
    </View>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <Stack.Screen name="Main" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
