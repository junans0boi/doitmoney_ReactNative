// src/screens/LoginScreen.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LoginForm from '../components/LoginForm';
import { useNavigation } from '@react-navigation/native';
import { commonStyles, colors } from '../styles/commonStyles';

export default function LoginScreen() {
  const navigation = useNavigation();

  return (
    <View style={[commonStyles.container, styles.container]}>
      {/* 상단 타이틀 */}
      <Text style={styles.title}>이메일로 로그인</Text>
      <Text style={styles.subTitle}>영문, 숫자, 특수문자를 조합하여 8자리 이상</Text>
      
      {/* 실제 로그인 폼 */}
      <LoginForm />

      {/* 하단부: 회원가입 이동 */}
      <View style={styles.bottomArea}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>
            아직 회원이 아니신가요? 회원가입
          </Text>
        </TouchableOpacity>
      </View>
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
  bottomArea: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});