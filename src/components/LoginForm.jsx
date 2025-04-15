// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { api } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { commonStyles, colors } from '../styles/commonStyles';

export default function LoginForm() {
  const navigation = useNavigation();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const user = await api.loginUser(credentials);
      console.log('로그인 성공:', user);

      // 세션 정보를 AsyncStorage에 저장
      await AsyncStorage.setItem('userSession', JSON.stringify(user));

      // 전역변수 예시
      global.userId = user.id;
      global.email = user.email;
      global.nickname = user.nickname;

      navigation.replace('MainTabs');
    } catch (err) {
      console.error('로그인 에러:', err);
      setError('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <View style={styles.formContainer}>
      {/* 이메일 입력 */}
      <TextInput
        style={[commonStyles.input, styles.input]}
        placeholder="이메일 주소"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={credentials.email}
        onChangeText={(text) => handleChange('email', text)}
      />

      {/* 비밀번호 입력 */}
      <TextInput
        style={[commonStyles.input, styles.input]}
        placeholder="비밀번호 (영문,숫자,특수문자 조합 8자 이상)"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={credentials.password}
        onChangeText={(text) => handleChange('password', text)}
      />

      {/* 오류 메시지 */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* 로그인 버튼 */}
      <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
        <Text style={commonStyles.buttonText}>로그인</Text>
      </TouchableOpacity>

      {/* 추가 링크: 아이디 찾기 / 비밀번호 찾기 */}
      <View style={styles.linkRow}>
        <TouchableOpacity>
          <Text style={styles.linkText}>아이디 찾기</Text>
        </TouchableOpacity>
        <Text style={styles.linkDivider}> | </Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 20,
  },
  input: {
    // commonStyles.input을 기반으로 커스텀
    marginBottom: 10,
  },
  errorText: {
    marginBottom: 10,
    color: 'red',
    fontSize: 14,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
  },
  linkDivider: {
    color: '#ccc',
  },
});