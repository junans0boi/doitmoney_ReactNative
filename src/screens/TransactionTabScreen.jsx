// src/screens/TransactionScreen.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import TransactionList from '../components/TransactionList';
import { api } from '../api/api';
import { commonStyles, colors } from '../styles/commonStyles'; 
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function TransactionTabScreen() {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = global.userId || null;

  // + 버튼 클릭 시 메뉴 열림/닫힘 애니메이션
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const fetchTransactions = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getTransactions(userId);
      setTransactions(data);
    } catch (error) {
      console.error('거래 내역 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [userId])
  );

  // 거래 직접 입력
  const handleManualAdd = () => {
    setMenuOpen(false);
    navigation.navigate('TransactionForm', { mode: 'add' });
  };

  // 사진으로 추가 (OCR)
  const handlePhotoAdd = () => {
    setMenuOpen(false);
    navigation.navigate('OcrImportScreen');
  };

  // (예정) SMS로 추가
  const handleSmsAdd = () => {
    setMenuOpen(false);
    Alert.alert('준비 중', 'SMS로 추가하기 기능은 추후 구현 예정입니다.');
  };

  if (!userId) {
    return (
      <View style={commonStyles.container}>
        <Text style={{ margin: 16 }}>로그인이 필요합니다.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={commonStyles.container}>
        <Text style={{ margin: 16 }}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <TransactionList
        transactions={transactions}
        onEditTransaction={(tx) => {
          navigation.navigate('TransactionForm', { mode: 'edit', existingTx: tx });
        }}
        onDeleteTransaction={async (tx) => {
          try {
            await api.deleteTransaction(userId, tx.id);
            Alert.alert('알림', '삭제 완료!');
            fetchTransactions();
          } catch (err) {
            console.error(err);
            Alert.alert('오류', '삭제 실패');
          }
        }}
      />

      {/* Floating + 버튼 */}
      <View style={styles.floatingMenuContainer}>
        <TouchableOpacity onPress={toggleMenu} style={styles.floatingBtn}>
          <Ionicons name={menuOpen ? "close" : "add"} size={30} color="#fff" />
        </TouchableOpacity>

        {/* 메뉴 항목들 (열릴 때만 보이기) */}
        {menuOpen && (
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleManualAdd}>
              <Ionicons name="create-outline" size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>직접 입력하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handlePhotoAdd}>
              <Ionicons name="image-outline" size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>사진으로 추가하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleSmsAdd}>
              <Ionicons name="chatbox-outline" size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>SMS로 추가하기 (예정)</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingMenuContainer: {
    position: 'absolute',
    right: 20,
    bottom: 50,
    alignItems: 'center',
  },
  floatingBtn: {
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    // 그림자 등 스타일은 필요에 맞게
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  menuItemText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
});