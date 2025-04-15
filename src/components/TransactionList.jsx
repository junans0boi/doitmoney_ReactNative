// src/components/TransactionList.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { commonStyles, colors, fontSizes } from '../styles/commonStyles';

// Helper 함수: 날짜 문자열 (YYYY-MM-DD)에서 "YYYY-MM" 부분 추출
const extractYearMonth = (dateStr) => dateStr.slice(0, 7);

// 달을 변경하는 함수 (YYYY-MM 문자열을 Date 객체로 변환 후 조작)
const changeMonth = (current, offset) => {
  const [year, month] = current.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + offset);
  const newYear = date.getFullYear();
  // 월을 2자리 문자열로 변환 (예, '08')
  const newMonth = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${newYear}-${newMonth}`;
};

export default function TransactionList({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
}) {
  // 현재 선택된 달 (YYYY-MM). 초기값은 현재 달.
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  // 보기 모드: 'monthly' (단순 목록), 'daily' (날짜별 그룹), 'summary' (요약)
  const [viewMode, setViewMode] = useState('monthly');
  // 옵션 메뉴가 열려있는 거래의 id (없으면 null)
  const [optionsVisibleId, setOptionsVisibleId] = useState(null);

  // 선택된 달에 해당하는 거래 내역 필터링
  const filteredTransactions = transactions.filter(
    (tx) => extractYearMonth(tx.transactionDate) === selectedMonth
  );

  // 일별 모드 시 날짜별 그룹화: { [date]: transactions[] }
  const groupByDay = (txList) => {
    return txList.reduce((groups, tx) => {
      const day = tx.transactionDate;
      if (!groups[day]) groups[day] = [];
      groups[day].push(tx);
      return groups;
    }, {});
  };

  // 요약 모드 시 카테고리별 합계 계산: { [category]: totalAmount }
  const summarizeByCategory = (txList) => {
    return txList.reduce((summary, tx) => {
      if (!summary[tx.category]) {
        summary[tx.category] = 0;
      }
      summary[tx.category] += Number(tx.amount);
      return summary;
    }, {});
  };

  // 뷰 모드별로 렌더링할 내용을 결정
  const renderContent = () => {
    if (viewMode === 'monthly') {
      // 단순 목록
      return (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTransactionItem}
          ListEmptyComponent={
            <Text style={styles.emptyText}>선택한 달에 거래 내역이 없습니다.</Text>
          }
          contentContainerStyle={styles.listContainer}
        />
      );
    } else if (viewMode === 'daily') {
      // 날짜별 그룹화하여 렌더링
      const groups = groupByDay(filteredTransactions);
      const dates = Object.keys(groups).sort();
      return (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {dates.length ? dates.map((date) => (
            <View key={date} style={styles.dayGroup}>
              <Text style={styles.dayGroupTitle}>{date}</Text>
              {groups[date].map((tx) => (
                <View key={tx.id}>{renderTransactionItem({ item: tx })}</View>
              ))}
            </View>
          )) : (
            <Text style={styles.emptyText}>선택한 달에 거래 내역이 없습니다.</Text>
          )}
        </ScrollView>
      );
    } else if (viewMode === 'summary') {
      // 카테고리별 요약: 각 카테고리와 거래 총액 표시
      const summary = summarizeByCategory(filteredTransactions);
      const categories = Object.keys(summary);
      return (
        <View style={styles.summaryContainer}>
          {categories.length ? categories.map((cat) => (
            <View key={cat} style={styles.summaryRow}>
              <Text style={styles.summaryCategory}>{cat}</Text>
              <Text style={styles.summaryAmount}>{summary[cat].toLocaleString()} 원</Text>
            </View>
          )) : (
            <Text style={styles.emptyText}>선택한 달에 거래 내역이 없습니다.</Text>
          )}
        </View>
      );
    }
  };

  // 각 거래 항목 렌더링, 옵션 버튼(ellipsis)을 포함
  const renderTransactionItem = ({ item }) => {
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDate}>{item.transactionDate}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          <Text style={styles.transactionAmount}>
            {Number(item.amount).toLocaleString()} 원
          </Text>
        </View>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() =>
            setOptionsVisibleId(optionsVisibleId === item.id ? null : item.id)
          }
        >
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.primary} />
        </TouchableOpacity>
        {optionsVisibleId === item.id && (
          <View style={styles.optionsMenu}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setOptionsVisibleId(null);
                onEditTransaction(item);
              }}
            >
              <Text style={styles.optionText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setOptionsVisibleId(null);
                onDeleteTransaction(item);
              }}
            >
              <Text style={styles.optionText}>삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // 상단에 달 선택 헤더 및 보기 모드 토글
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => setSelectedMonth(changeMonth(selectedMonth, -1))}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
      <Text style={styles.currentMonth}>{selectedMonth}</Text>
      <TouchableOpacity
        onPress={() => setSelectedMonth(changeMonth(selectedMonth, 1))}
      >
        <Ionicons name="arrow-forward" size={24} color={colors.text} />
      </TouchableOpacity>
      <View style={styles.viewModeContainer}>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'monthly' && styles.viewModeButtonActive,
          ]}
          onPress={() => setViewMode('monthly')}
        >
          <Text
            style={[
              styles.viewModeText,
              viewMode === 'monthly' && styles.viewModeTextActive,
            ]}
          >
            월별
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'daily' && styles.viewModeButtonActive,
          ]}
          onPress={() => setViewMode('daily')}
        >
          <Text
            style={[
              styles.viewModeText,
              viewMode === 'daily' && styles.viewModeTextActive,
            ]}
          >
            일별
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'summary' && styles.viewModeButtonActive,
          ]}
          onPress={() => setViewMode('summary')}
        >
          <Text
            style={[
              styles.viewModeText,
              viewMode === 'summary' && styles.viewModeTextActive,
            ]}
          >
            요약
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  currentMonth: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  viewModeContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  viewModeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
    borderRadius: 4,
    backgroundColor: '#eee',
  },
  viewModeButtonActive: {
    backgroundColor: colors.primary,
  },
  viewModeText: {
    fontSize: 14,
    color: colors.text,
  },
  viewModeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 1,
    
  },
  emptyText: {
    textAlign: 'center',
    color: colors.label,
    fontSize: 16,
  },
  dayGroup: {
    marginBottom: 16,
  },
  dayGroupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  summaryContainer: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  summaryCategory: {
    fontSize: 16,
    color: colors.text,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  transactionItem: {
    backgroundColor: '#fffff9',
    padding: 18,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDate: {
    fontSize: 14,
    color: colors.label,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  transactionAmount: {
    fontSize: 16,
    color: colors.text,
  },
  optionsButton: {
    padding: 4,
  },
  optionsMenu: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    zIndex: 100,
  },
  optionItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  optionText: {
    fontSize: 14,
    color: colors.primary,
  },
});