// src/screens/AssetTabScreen.jsx
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, Switch } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { api } from '../api/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getLogo } from '../constants/logoMapping';
import { commonStyles, colors } from '../styles/commonStyles';

export default function AssetTabScreen() {
  const navigation = useNavigation();
  const userId = global.userId;
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccountIds, setSelectedAccountIds] = useState([]);
  const [showSelectModal, setShowSelectModal] = useState(false);

  const fetchAccounts = async () => {
    try {
      const data = await api.getAccounts(userId);
      setAccounts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    setLoading(true);
    fetchAccounts();
  }, [userId]));

  const handleEdit = (acc) => {
    navigation.navigate('AccountForm', { mode: 'edit', account: acc, userId });
  };

  const handleDelete = (acc) => {
    Alert.alert('삭제 확인', '이 자산을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제', style: 'destructive', onPress: async () => {
          try {
            await api.deleteAccount(userId, acc.id);
            Alert.alert('삭제 완료');
            fetchAccounts();
          } catch (err) {
            console.error(err);
            Alert.alert('오류', '삭제 중 문제가 발생했습니다.');
          }
        }
      }
    ]);
  };

  const renderRightActions = (acc) => (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', width: 85, backgroundColor: '#f1c40f' }}
        onPress={() => handleEdit(acc)}>
        <Text style={{ color: '#fff', fontWeight: 'bold', padding: 10 }}>수정</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', width: 85, backgroundColor: '#e74c3c' }}
        onPress={() => handleDelete(acc)}>
        <Text style={{ color: '#fff', fontWeight: 'bold', padding: 10 }}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAccountItem = (acc) => {
    const logoSource = getLogo(acc.institutionName, acc.accountType);
    let maskedNumber = acc.accountNumber || '';
    if (maskedNumber.length > 3) {
      maskedNumber = `****${maskedNumber.slice(-3)}`;
    }
    return (
      <Swipeable key={acc.id} renderRightActions={() => renderRightActions(acc)}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff' }}>
          {logoSource ? (
            <Image source={logoSource} style={{ width: 50, height: 50, marginRight: 10, resizeMode: 'contain', borderRadius: 10 }} />
          ) : (
            <View style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F56695' }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                {acc.institutionName ? acc.institutionName.charAt(0) : '-'}
              </Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>{acc.institutionName}</Text>
            {acc.accountNumber && (
              <Text style={{ marginTop: 2, fontSize: 14, color: '#999' }}>
                {maskedNumber} {acc.accountType === 'BANK' && '입출금통장'}
              </Text>
            )}
          </View>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#333' }}>
            {acc.balance.toLocaleString()}원
          </Text>
        </View>
      </Swipeable>
    );
  };

  const totalAsset = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  if (!userId) {
    return (
      <View style={commonStyles.container}>
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text>로그인이 필요합니다.</Text>
        </View>
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
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 16, color: '#666', marginBottom: 4 }}>4월 총자산</Text>
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#000' }}>
            {totalAsset.toLocaleString()}원
          </Text>
        </View>
        <View style={{ backgroundColor: '#fff' }}>
          {accounts.map(renderAccountItem)}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderTopColor: '#f0f0f0', borderTopWidth: 1, backgroundColor: '#fff' }}
        onPress={() => navigation.navigate('AccountForm', { mode: 'add', userId })}
      >
        <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
        <Text style={{ marginLeft: 8, fontSize: 16, color: colors.primary, fontWeight: '500' }}>계좌 추가</Text>
      </TouchableOpacity>
    </View>
  );
}