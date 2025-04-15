// src/screens/TransactionTabScreen.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import TransactionList from '../components/TransactionList';
import { api } from '../api/api';
import { commonStyles } from '../styles/commonStyles';

export default function TransactionTabScreen() {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = global.userId || null;

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

  const handleAddClick = () => {
    navigation.navigate('TransactionForm', { mode: 'add' });
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
      <View style={styles.floatingBtnContainer}>
        <Button title="+" onPress={handleAddClick} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingBtnContainer: {
    position: 'absolute',
    right: 20,
    bottom: 50,
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
  },
});