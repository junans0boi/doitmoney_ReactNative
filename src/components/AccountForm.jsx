// src/components/AccountForm.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert, FlatList, TouchableOpacity, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../api/api';
import { bankList, cardList, bankLogos, cardLogos } from '../constants/logoMapping';
import { FormLabel, FormInput, FormButton } from './common/FormComponents';
import { FormPicker } from './common/FormPicker';
import { commonStyles } from '../styles/commonStyles';

export default function AccountForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const { mode = 'add', account = null, userId = global.userId } = route.params || {};

  const [accountData, setAccountData] = useState({
    accountType: 'BANK',
    institutionName: '',
    accountNumber: '',
    balance: '',
  });
  const [showBankModal, setShowBankModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && account) {
      setAccountData({
        accountType: account.accountType,
        institutionName: account.institutionName,
        accountNumber: account.accountNumber || '',
        balance: String(account.balance),
      });
    }
  }, [mode, account]);

  const handleChange = (name, value) => {
    setAccountData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!accountData.institutionName.trim() || accountData.balance.trim() === '') {
      Alert.alert('오류', '기관명과 잔액은 필수 입력값입니다.');
      return;
    }
    if (!userId) {
      Alert.alert('오류', '로그인이 필요합니다.');
      return;
    }
    const payload = { ...accountData, balance: Number(accountData.balance) };
    try {
      let res;
      if (mode === 'edit' && account) {
        res = await api.updateAccount(userId, account.id, payload);
        Alert.alert('성공', '계좌 정보가 수정되었습니다.');
      } else {
        res = await api.addAccount(userId, payload);
        Alert.alert('성공', '계좌가 등록되었습니다.');
      }
      navigation.goBack();
    } catch (err) {
      console.error('계좌 저장 에러:', err);
      Alert.alert('실패', mode === 'edit' ? '계좌 수정 중 오류가 발생했습니다.' : '계좌 등록 중 오류가 발생했습니다.');
    }
  };

  const renderBankItem = ({ item }) => (
    <TouchableOpacity
      style={{ alignItems: 'center', justifyContent: 'center', width: '28%', margin: 10 }}
      onPress={() => {
        handleChange('institutionName', item);
        setShowBankModal(false);
      }}
    >
      <Image source={bankLogos[item]} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
      <Text style={{ marginTop: 8, fontSize: 12, textAlign: 'center', color: '#555' }}>{item}</Text>
    </TouchableOpacity>
  );

  const renderCardItem = ({ item }) => (
    <TouchableOpacity
      style={{ alignItems: 'center', justifyContent: 'center', width: '28%', margin: 10 }}
      onPress={() => {
        handleChange('institutionName', item);
        setShowCardModal(false);
      }}
    >
      {cardLogos[item] ? (
        <Image source={cardLogos[item]} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
      ) : (
        <View style={{ width: 50, height: 50, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}>
          <Text style={{ fontSize: 12, color: '#666' }}>{item}</Text>
        </View>
      )}
      <Text style={{ marginTop: 8, fontSize: 12, textAlign: 'center', color: '#555' }}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={commonStyles.container}>
      {/* <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={commonStyles.headerTitle.color} />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>{mode === 'edit' ? '자산 수정' : '자산 등록'}</Text>
      </View> */}

      <FormLabel>계좌 유형</FormLabel>
      <FormPicker
        selectedValue={accountData.accountType}
        onValueChange={(value) => {
          handleChange('accountType', value);
          handleChange('institutionName', '');
        }}
      >
        <FormPicker.Item label="은행" value="BANK" />
        <FormPicker.Item label="카드" value="CARD" />
        <FormPicker.Item label="현금" value="CASH" />
        <FormPicker.Item label="기타" value="ETC" />
      </FormPicker>

      <FormLabel>기관명</FormLabel>
      {accountData.accountType === 'BANK' && (
        <>
          <TouchableOpacity style={commonStyles.input} onPress={() => setShowBankModal(true)}>
            <Text style={{ fontSize: 16, color: accountData.institutionName ? commonStyles.headerTitle.color : '#999' }}>
              {accountData.institutionName || '은행을 선택하세요'}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={showBankModal}
            animationType="slide"
            onRequestClose={() => setShowBankModal(false)}
            presentationStyle="fullScreen"
          >
            <View style={{ flex: 1 }}>
              {/* Full screen header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
                <TouchableOpacity onPress={() => setShowBankModal(false)}>
                  <Ionicons name="arrow-back" size={24} color={commonStyles.headerTitle.color} />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 16 }}>은행 선택</Text>
              </View>
              <FlatList
                data={bankList}
                keyExtractor={(item) => item}
                renderItem={renderBankItem}
                numColumns={3}
                contentContainerStyle={{ padding: 16 }}
              />
            </View>
          </Modal>
        </>
      )}

      {accountData.accountType === 'CARD' && (
        <>
          <TouchableOpacity style={commonStyles.input} onPress={() => setShowCardModal(true)}>
            <Text style={{ fontSize: 16, color: accountData.institutionName ? commonStyles.headerTitle.color : '#999' }}>
              {accountData.institutionName || '카드를 선택하세요'}
            </Text>
          </TouchableOpacity>
          {showCardModal && (
            <Modal
              visible={showCardModal}
              animationType="slide"
              onRequestClose={() => setShowCardModal(false)}
              presentationStyle="fullScreen"
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
                  <TouchableOpacity onPress={() => setShowCardModal(false)}>
                    <Ionicons name="arrow-back" size={24} color={commonStyles.headerTitle.color} />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 16 }}>카드 선택</Text>
                </View>
                <FlatList
                  data={cardList}
                  keyExtractor={(item) => item}
                  renderItem={renderCardItem}
                  numColumns={3}
                  contentContainerStyle={{ padding: 16 }}
                />
              </View>
            </Modal>
          )}
        </>
      )}

      {(accountData.accountType === 'CASH' || accountData.accountType === 'ETC') && (
        <FormInput
          value={accountData.institutionName}
          onChangeText={(text) => handleChange('institutionName', text)}
          placeholder="기관명을 입력하세요"
        />
      )}

      <FormLabel>계좌번호</FormLabel>
      <FormInput
        value={accountData.accountNumber}
        onChangeText={(text) => handleChange('accountNumber', text)}
        placeholder="계좌번호 입력"
        keyboardType="number-pad"
      />

      <FormLabel>잔액</FormLabel>
      <FormInput
        value={accountData.balance}
        onChangeText={(text) => handleChange('balance', text)}
        placeholder="잔액 입력"
        keyboardType="numeric"
      />

      <FormButton title={mode === 'edit' ? '저장' : '계좌 등록'} onPress={handleSubmit} />
    </View>
  );
}