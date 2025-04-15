// src/screens/RegisterScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RegisterForm from '../components/RegisterForm';
import { commonStyles, colors } from '../styles/commonStyles';

export default function RegisterScreen() {
  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text style={styles.title}>회원가입</Text>
      <Text style={styles.subTitle}>서비스 이용약관을 확인해 주세요</Text>

      <RegisterForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  subTitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 30,
  },
});