// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { api } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import { commonStyles, colors } from '../styles/commonStyles';

export default function RegisterForm() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({ email: '', password: '', nickname: '' });
  const [error, setError] = useState('');

  const handleChange = (name, value) => {
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const user = await api.registerUser(userData);
      console.log('회원가입 성공:', user);
      navigation.replace('Login');
    } catch (err) {
      console.error('회원가입 에러:', err);
      setError('회원가입 실패: 이미 존재하는 이메일일 수 있습니다.');
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
        value={userData.email}
        onChangeText={(text) => handleChange('email', text)}
      />

      {/* 비밀번호 입력 */}
      <TextInput
        style={[commonStyles.input, styles.input]}
        placeholder="비밀번호 (영문,숫자,특수문자 조합 8자 이상)"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={userData.password}
        onChangeText={(text) => handleChange('password', text)}
      />

      {/* 닉네임 입력 */}
      <TextInput
        style={[commonStyles.input, styles.input]}
        placeholder="닉네임"
        placeholderTextColor="#aaa"
        value={userData.nickname}
        onChangeText={(text) => handleChange('nickname', text)}
      />

      {/* 에러 메시지 */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* 회원가입 버튼 */}
      <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
        <Text style={commonStyles.buttonText}>다음</Text>
      </TouchableOpacity>

      {/* 약관 동의, 등 추가 UI는 상황에 맞춰 배치 */}
      {/* 예: 아래처럼 */}
      <View style={styles.agreementBox}>
        <Text style={styles.agreementTitle}>약관 및 이용동의</Text>
        {/* 펼침 UI 등은 별도 구현 */}
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
  agreementBox: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  agreementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
});