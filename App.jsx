// App.jsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native'; // Text 추가
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import AssetTabScreen from './src/screens/AssetTabScreen';
import TransactionTabScreen from './src/screens/TransactionTabScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import TransactionForm from './src/components/TransactionForm';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AccountForm from './src/components/AccountForm';

import { colors } from './src/styles/commonStyles';

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        // 하단 탭 아이콘
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Asset') iconName = 'wallet';
          else if (route.name === 'Transaction') iconName = 'document-text';
          else if (route.name === 'Chatbot') iconName = 'chatbubbles';
          else if (route.name === 'Profile') iconName = 'ellipsis-horizontal';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerTitleAlign: 'center',
        // 여기서 headerTitleStyle로 다른 탭들의 기본 폰트 지정
        headerTitleStyle: {
          fontFamily: 'GmarketSansBold',
          fontSize: 20,
        },
      })}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          // Home 탭만 헤더 타이틀을 "직접 렌더링"
          headerTitle: () => (
            <Text style={{ fontSize: 20, color: '#7654ff', fontFamily: 'GmarketSansBold' }}>
              DoitMoney
            </Text>
          ),
          headerTitleAlign: 'left',
        }}
      />
      <BottomTab.Screen
        name="Asset"
        component={AssetTabScreen}
        options={{
          title: '자산',
        }}
      />
      <BottomTab.Screen
        name="Transaction"
        component={TransactionTabScreen}
        options={{
          title: '가계부',
        }}
      />
      <BottomTab.Screen
        name="Chatbot"
        component={ChatbotScreen}
        options={{
          title: '차트',
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '더보기',
        }}
      />
    </BottomTab.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const session = await AsyncStorage.getItem('userSession');
      if (session) {
        const user = JSON.parse(session);
        global.userId = user.id;
        global.email = user.email;
        global.nickname = user.nickname;
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'left',
          // headerBackTitleVisible: false,
          // 스택 내 스크린의 기본 헤더 폰트도 G마켓SansBold로 지정 가능
          headerTitleStyle: {
            fontFamily: 'GmarketSansMedium',
            fontSize: 20,
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: '로그인' }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: '회원가입' }}
        />

        <Stack.Screen
          name="TransactionForm"
          component={TransactionForm}
          options={{ title: '거래 등록/수정' }}
        />

        <Stack.Screen
          name="AccountForm"
          component={AccountForm}
          options={{ title: '계좌 등록/수정' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}