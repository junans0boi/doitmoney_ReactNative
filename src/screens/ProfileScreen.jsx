// src/screens/ProfileScreen.jsx

import React, { useState, useEffect } from 'react';
import { 
  View, Text, Button, StyleSheet, TouchableOpacity, Image, ScrollView, 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { commonStyles, colors, fontSizes } from '../styles/commonStyles';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUserId = global.userId || null;
    const savedEmail = global.email || '';
    const savedNickname = global.nickname || '';
    if (savedUserId) {
      setUser({
        id: savedUserId,
        email: savedEmail,
        nickname: savedNickname,
      });
    }
  }, []);

  const handleLogout = () => {
    global.userId = null;
    global.email = null;
    global.nickname = null;
    setUser(null);
  };

  // 로그인 안 된 경우
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>마이페이지</Text>
        <Text>로그인이 필요합니다.</Text>
        <Button title="로그인" onPress={() => navigation.navigate('Login')} />
        <Button title="회원가입" onPress={() => navigation.navigate('Register')} />
      </View>
    );
  }

  // 로그인 된 경우
  return (
    <ScrollView style={styles.container}>
      {/* 상단 사용자 인사영역 */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>
          안녕하세요! {user.nickname}님
        </Text>
        <TouchableOpacity>
          <Text style={styles.profileLink}>
            내 프로필 보기
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1. 주요 기능들 (공지, 이벤트, 고객센터) */}
      <View style={styles.shortcutRow}>
        <ShortcutItem icon="notifications-outline" label="공지" />
        <ShortcutItem icon="sparkles-outline" label="이벤트" />
        <ShortcutItem icon="help-circle-outline" label="고객센터" />
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 2. 생활 속 편의기능 */}
      <Text style={styles.sectionTitle}>생활 속 편의기능</Text>
      <View style={styles.featureList}>
        <FeatureItem icon="pricetags-outline" label="비밀번호 변경" />
        <FeatureItem icon="cash-outline" label="정기 결제 관리" />
        <FeatureItem icon="wallet-outline" label="핀크머니 입금전용계좌" />
        <FeatureItem icon="document-text-outline" label="거래확인증" />
        <FeatureItem icon="gift-outline" label="아직 미정" />
        <FeatureItem icon="timer-outline" label="회원탈퇴"  />
        <FeatureItem icon="airplane-outline" label="로그아웃" onPress={handleLogout} />
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 3. 설정 / 로그아웃 등 */}
      <View style={styles.infoBox}>
        <TouchableOpacity style={styles.infoRow}>
          <Text style={styles.infoLabel}>비밀번호 변경</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRow}>
          <Text style={styles.infoLabel}>정기 결제 관리</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRow}>
          <Text style={styles.infoLabel}>약관 및 이용동의</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRow}>
          <Text style={styles.infoLabel}>회원탈퇴</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRow} onPress={handleLogout}>
          <Text style={[styles.infoLabel, { color: colors.accent }]}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/** 아이콘 + 라벨 (가로 방향) */
function ShortcutItem({ icon, label }) {
  return (
    <TouchableOpacity style={styles.shortcutItem}>
      <Ionicons name={icon} size={28} color={colors.primary} style={{ marginBottom: 4 }} />
      <Text style={styles.shortcutLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

/** 아이콘 + 라벨 (세로 방향, 그리드 형태) */
function FeatureItem({ icon, label }) {
  return (
    <TouchableOpacity style={styles.featureItem}>
      <Ionicons name={icon} size={26} color="#666" style={{ marginBottom: 6 }} />
      <Text style={styles.featureLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container, // flex:1, background, padding:16
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
    color: colors.text,
    fontWeight: 'bold',
  },
  greetingContainer: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  profileLink: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  shortcutItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutLabel: {
    fontSize: 12,
    color: '#333',
  },
  divider: {
    height: 8,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12,
  },
  featureList: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  featureItem: {
    width: '50%', // 2열 그리드로
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureLabel: {
    fontSize: 13,
    color: '#666',
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 40,
    padding: 8,
  },
  infoRow: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text,
  },
});