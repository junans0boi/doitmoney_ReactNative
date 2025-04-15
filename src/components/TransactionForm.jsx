// src/components/TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, TouchableOpacity, Switch, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FormLabel, FormInput, FormButton } from './common/FormComponents';
import { FormPicker } from './common/FormPicker';
import { Picker } from '@react-native-picker/picker';
import { api } from '../api/api';
import { commonStyles } from '../styles/commonStyles';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function TransactionForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const userId = global.userId || null;
  const { mode = 'add', existingTx = null } = route.params || {};

  const [transactionType, setTransactionType] = useState('expense');
  const [isRepeat, setIsRepeat] = useState(false);
  const [transaction, setTransaction] = useState({
    transactionDate: '',
    amount: '',
    category: '',
    customCategory: '',
    asset: '',
    description: '',
  });
  const [repeatDay, setRepeatDay] = useState('');
  const [accounts, setAccounts] = useState([]);
  const CATEGORIES = ['식비', '교통/차량', '문화생활', '마트/편의점', '패션/미용',
    '생활용품', '주거', '건강', '교육', '통신', '경조사/회비',
    '부모님', '기타', '직접 입력'];

  useEffect(() => {
    if (mode === 'edit' && existingTx) {
      setTransaction({
        transactionDate: existingTx.transactionDate || '',
        amount: existingTx.amount ? String(existingTx.amount) : '',
        category: existingTx.category || '',
        customCategory: '',
        asset: '',
        description: existingTx.description || '',
      });
      setTransactionType(existingTx.transactionType);
    }
  }, [mode, existingTx]);

  useEffect(() => {
    async function fetchAccounts() {
      if (!userId) return;
      try {
        const data = await api.getAccounts(userId);
        setAccounts(data);
      } catch (err) {
        console.error('자산 목록 불러오기 에러:', err);
      }
    }
    fetchAccounts();
  }, [userId]);

  const handleChange = (name, value) => {
    setTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleAmountChange = (value) => {
    const numericValue = value.replace(/,/g, '');
    if (numericValue === '' || !isNaN(numericValue)) {
      const formatted = numericValue === '' ? '' : Number(numericValue).toLocaleString();
      setTransaction(prev => ({ ...prev, amount: formatted }));
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }
    try {
      const finalCategory = transaction.category === '직접 입력'
        ? (transaction.customCategory || '기타')
        : transaction.category;
      const numericAmount = Number(transaction.amount.replace(/,/g, '')) || 0;
      let payload;
      if (mode === 'edit' && existingTx) {
        payload = {
          transactionDate: transaction.transactionDate,
          transactionType,
          category: finalCategory,
          amount: numericAmount,
          description: transaction.description,
        };
        if (transaction.asset) {
          const acc = accounts.find(a => a.id.toString() === transaction.asset);
          if (acc) {
            payload.accountName = acc.institutionName;
            payload.accountNumber = acc.accountNumber;
          }
        }
        await api.updateTransaction(userId, existingTx.id, payload);
        Alert.alert('알림', '거래가 수정되었습니다.');
      } else if (isRepeat) {
        payload = {
          amount: numericAmount,
          category: finalCategory,
          content: transaction.description,
          dayOfMonth: parseInt(repeatDay, 10) || 1,
          transactionType,
        };
        await api.addFixedExpense(userId, payload);
        Alert.alert('알림', '고정지출이 등록되었습니다.');
      } else {
        payload = {
          transactionDate: transaction.transactionDate,
          transactionType,
          category: finalCategory,
          amount: numericAmount,
          description: transaction.description,
        };
        if (transaction.asset) {
          const acc = accounts.find(a => a.id.toString() === transaction.asset);
          if (acc) {
            payload.accountName = acc.institutionName;
            payload.accountNumber = acc.accountNumber;
          }
        }
        await api.addTransaction(userId, payload);
        Alert.alert('알림', '거래가 등록되었습니다.');
      }
      navigation.goBack();
    } catch (err) {
      console.error('거래 저장 에러:', err);
      Alert.alert('오류', mode === 'edit'
        ? '거래 수정 중 오류가 발생했습니다.'
        : '거래 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <ScrollView style={commonStyles.container}>
      {/* <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={commonStyles.headerTitle.color} />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>{mode === 'edit' ? '거래 수정' : '거래 등록'}</Text>
      </View> */}

      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        {['income', 'expense', 'transfer'].map(type => (
          <TouchableOpacity
            key={type}
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: '#f1f1f1',
              alignItems: 'center',
              borderBottomWidth: transactionType === type ? 2 : 0,
              borderBottomColor: '#f74d4d'
            }}
            onPress={() => setTransactionType(type)}
          >
            <Text style={{ color: transactionType === type ? '#f74d4d' : '#555', fontWeight: transactionType === type ? 'bold' : 'normal' }}>
              {type === 'income' ? '수입' : type === 'expense' ? '지출' : '이체'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FormLabel>날짜 (YYYY-MM-DD)</FormLabel>
      <FormInput
        placeholder="YYYY-MM-DD"
        value={transaction.transactionDate}
        onChangeText={txt => handleChange('transactionDate', txt)}
        editable={!isRepeat}
      />

      <FormLabel>금액</FormLabel>
      <FormInput
        placeholder="0"
        value={transaction.amount}
        onChangeText={handleAmountChange}
        keyboardType="numeric"
      />

      <FormLabel>분류</FormLabel>
      <FormPicker
        selectedValue={transaction.category}
        onValueChange={val => {
          handleChange('category', val);
          if (val !== '직접 입력') {
            handleChange('customCategory', '');
          }
        }}
      >
        <Picker.Item label="-- 선택 --" value="" />
        {CATEGORIES.map(cat => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </FormPicker>

      {transaction.category === '직접 입력' && (
        <>
          <FormLabel>직접입력</FormLabel>
          <FormInput
            placeholder="예: 예적금, 투자 등"
            value={transaction.customCategory}
            onChangeText={txt => handleChange('customCategory', txt)}
          />
        </>
      )}

      <FormLabel>자산</FormLabel>
      <FormPicker
        selectedValue={transaction.asset}
        onValueChange={val => handleChange('asset', val)}
      >
        <Picker.Item label="-- 선택하세요 --" value="" />
        {accounts.map(acc => (
          <Picker.Item
            key={acc.id}
            label={`${acc.institutionName} (${acc.accountNumber || ''})`}
            value={acc.id.toString()}
          />
        ))}
      </FormPicker>
      <FormButton title="자산추가" onPress={() => navigation.navigate('AccountForm', { mode: 'add', userId })} />

      <FormLabel>고정지출 여부 (반복/할부)</FormLabel>
      <Switch value={isRepeat} onValueChange={setIsRepeat} disabled={mode === 'edit'} />
      {isRepeat && (
        <>
          <FormLabel>반복일 (1~31)</FormLabel>
          <FormInput
            keyboardType="numeric"
            value={repeatDay}
            onChangeText={setRepeatDay}
          />
        </>
      )}

      <FormLabel>메모</FormLabel>
      <FormInput
        placeholder="메모"
        value={transaction.description}
        onChangeText={txt => handleChange('description', txt)}
      />

      <FormButton title={mode === 'edit' ? '수정하기' : '등록하기'} onPress={handleSubmit} />
    </ScrollView>
  );
}