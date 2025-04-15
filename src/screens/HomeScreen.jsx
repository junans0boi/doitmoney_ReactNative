// src/screens/HomeScene.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NewsCarousel from '../components/NewsCarousel';
import { getLogo } from '../constants/logoMapping';
import { commonStyles, colors } from '../styles/commonStyles';
import HomeSceneStyles from './HomeScene.styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { api } from '../api/api';

export default function HomeScene() {
  const navigation = useNavigation();
  const userId = global.userId || null;
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('BANK');
  const [selectedAccountIds, setSelectedAccountIds] = useState([]);
  const [showSelectModal, setShowSelectModal] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    async function fetchAccounts() {
      try {
        const data = await api.getAccounts(userId);
        setAccounts(data);
      } catch (error) {
        console.error('자산 정보 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAccounts();
  }, [userId]);

  const totalBalance = accounts.reduce((acc, cur) => acc + cur.balance, 0);
  const bankCount = accounts.filter(acc => acc.accountType === 'BANK').length;
  const cardCount = accounts.filter(acc => acc.accountType === 'CARD').length;
  const totalCount = accounts.length;

  const getDisplayedAccounts = () => {
    let filtered = selectedTab === 'BANK'
      ? accounts.filter(acc => acc.accountType === 'BANK')
      : accounts.filter(acc => acc.accountType === 'CARD');
    if (selectedAccountIds.length > 0) {
      filtered = filtered.filter(acc => selectedAccountIds.includes(acc.id));
    }
    return filtered.slice(0, 3);
  };

  const displayedAccounts = getDisplayedAccounts();

  const toggleAccountSelection = (accountId) => {
    if (selectedAccountIds.includes(accountId)) {
      setSelectedAccountIds(prev => prev.filter(id => id !== accountId));
    } else {
      if (selectedAccountIds.length >= 3) {
        Alert.alert('계좌 선택', '최대 3개까지만 선택할 수 있습니다.');
        return;
      }
      setSelectedAccountIds(prev => [...prev, accountId]);
    }
  };

  const QuickMenuItem = ({ icon, label }) => (
    <TouchableOpacity style={HomeSceneStyles.quickMenuItem}>
      <Ionicons name={icon} size={24} color="#666" style={HomeSceneStyles.quickMenuIcon} />
      <Text style={HomeSceneStyles.quickMenuLabel}>{label}</Text>
    </TouchableOpacity>
  );

  if (!userId) {
    return (
      <View style={commonStyles.container}>
        <View style={HomeSceneStyles.notLoggedIn}>
          <Text>로그인이 필요합니다.</Text>
        </View>
      </View>
    );
  }
  if (loading) {
    return (
      <View style={commonStyles.container}>
        <View style={HomeSceneStyles.loadingContainer}>
          <Text>로딩 중...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView contentContainerStyle={HomeSceneStyles.contentContainer}>
        <NewsCarousel />
        <View style={HomeSceneStyles.assetCard}>
          <View style={HomeSceneStyles.assetHeader}>
            <Text style={HomeSceneStyles.assetHeaderText}>총자산</Text>
            <Text style={HomeSceneStyles.assetAmountText}>{totalBalance.toLocaleString()}원</Text>
          </View>
          <View style={HomeSceneStyles.assetListRow}>
            {displayedAccounts.length > 0 ? (
              displayedAccounts.map(acc => {
                const logoSource = getLogo(acc.institutionName, acc.accountType);
                let maskedNumber = acc.accountNumber || '';
                if (maskedNumber.length > 3) {
                  maskedNumber = `****${maskedNumber.slice(-3)}`;
                }
                return (
                  <View style={HomeSceneStyles.assetItem} key={acc.id}>
                    {logoSource ? (
                      <Image source={logoSource} style={HomeSceneStyles.assetLogo} />
                    ) : (
                      <View style={HomeSceneStyles.defaultLogo}>
                        <Text style={HomeSceneStyles.defaultLogoText}>
                          {acc.institutionName ? acc.institutionName.charAt(0) : '은행'}
                        </Text>
                      </View>
                    )}
                    <Text style={HomeSceneStyles.assetBalance}>{acc.balance.toLocaleString()}원</Text>
                    <Text style={HomeSceneStyles.assetMask}>{maskedNumber}</Text>
                  </View>
                );
              })
            ) : (
              <View style={HomeSceneStyles.assetItem}>
                <Text style={HomeSceneStyles.assetBalance}>0원</Text>
                <Text style={HomeSceneStyles.assetMask}>
                  표시할 {selectedTab === 'BANK' ? '계좌' : '카드'}가 없습니다.
                </Text>
              </View>
            )}
          </View>
          <View style={HomeSceneStyles.assetTabRow}>
            <TouchableOpacity style={HomeSceneStyles.tabButton} onPress={() => setSelectedTab('BANK')}>
              <Text style={[HomeSceneStyles.tabText, selectedTab === 'BANK' && HomeSceneStyles.tabTextActive]}>
                계좌 {bankCount}
              </Text>
            </TouchableOpacity>
            <Text style={HomeSceneStyles.tabDivider}>|</Text>
            <TouchableOpacity style={HomeSceneStyles.tabButton} onPress={() => setSelectedTab('CARD')}>
              <Text style={[HomeSceneStyles.tabText, selectedTab === 'CARD' && HomeSceneStyles.tabTextActive]}>
                카드 {cardCount}
              </Text>
            </TouchableOpacity>
            <Text style={HomeSceneStyles.tabDivider}>|</Text>
            <TouchableOpacity style={HomeSceneStyles.tabButton} onPress={() => navigation.navigate('Asset')}>
              <Text style={HomeSceneStyles.tabText}>전체 {totalCount}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={HomeSceneStyles.selectButton}
            onPress={() => setShowSelectModal(true)}
          >
            <Text style={HomeSceneStyles.selectButtonText}>
              내가 표시할 계좌 직접 선택 (최대 3)
            </Text>
          </TouchableOpacity>
        </View>
        <View style={HomeSceneStyles.quickMenuContainer}>
          <View style={HomeSceneStyles.quickRow}>
            <QuickMenuItem icon="gift-outline" label="무료이보내줌" />
            <QuickMenuItem icon="flash-outline" label="번개대출" />
            <QuickMenuItem icon="pie-chart-outline" label="주식/펀드" />
            <QuickMenuItem icon="card-outline" label="2%체크카드" />
            <QuickMenuItem icon="pricetag-outline" label="10%할인" />
          </View>
          <View style={HomeSceneStyles.quickRow}>
            <QuickMenuItem icon="stats-chart-outline" label="신용점수" />
            <QuickMenuItem icon="briefcase-outline" label="내보험조회" />
            <QuickMenuItem icon="trending-up-outline" label="5%적금" />
            <View style={HomeSceneStyles.quickMenuItemEmpty} />
            <View style={HomeSceneStyles.quickMenuItemEmpty} />
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={showSelectModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSelectModal(false)}
      >
        <View style={commonStyles.modalOverlay}>
          <View style={commonStyles.modalContainer}>
            <Text style={commonStyles.modalTitle}>표시할 계좌/카드를 최대 3개까지 선택</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {accounts.map(acc => {
                const isSelected = selectedAccountIds.includes(acc.id);
                return (
                  <View key={acc.id} style={HomeSceneStyles.modalItemRow}>
                    <Text style={HomeSceneStyles.modalItemText}>
                      [{acc.accountType}] {acc.institutionName} ({acc.accountNumber})
                    </Text>
                    <Switch value={isSelected} onValueChange={() => toggleAccountSelection(acc.id)} />
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={HomeSceneStyles.modalConfirmButton}
              onPress={() => setShowSelectModal(false)}
            >
              <Text style={HomeSceneStyles.modalConfirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}