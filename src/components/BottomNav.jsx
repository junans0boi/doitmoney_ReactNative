// src/components/BottomNav.jsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { commonStyles, colors } from '../styles/commonStyles'; // 추가

export default function BottomNav() {
  const navigation = useNavigation();
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={20} style={styles.navIcon} />
        <Text style={styles.navLabel}>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Asset')}>
        <Ionicons name="wallet" size={20} style={styles.navIcon} />
        <Text style={styles.navLabel}>자산</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Transaction')}>
        <Ionicons name="document-text" size={20} style={styles.navIcon} />
        <Text style={styles.navLabel}>가계부</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Chatbot')}>
        <Ionicons name="analytics" size={20} style={styles.navIcon} />
        <Text style={styles.navLabel}>차트</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
        <Ionicons name="ellipsis-horizontal" size={20} style={styles.navIcon} />
        <Text style={styles.navLabel}>더보기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopColor: '#eee',
    borderTopWidth: 1,
    height: 60,
    zIndex: 999,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    marginBottom: 4,
    // color: '#6C4EFF', // 기존 코드
    color: colors.primary, // commonStyles의 primary 색상 사용
  },
  navLabel: {
    fontSize: 12,
    // color: '#6C4EFF', // 기존 코드
    color: colors.primary, // commonStyles의 primary 색상 사용
  },
});