// src/styles/commonStyles.js
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#6C4EFF',  // 브랜드 메인 색상
  accent: '#f74d4d',
  background: '#ffffff',
  text: '#333333',
  label: '#555555',
  border: '#dddddd',
  lightBg: '#f9f9f9',
  modalOverlay: 'rgba(0,0,0,0.5)',
};

export const fontSizes = {
  header: 22,
  title: 20,      // 타이틀 크기를 조금 더 크게 조정
  label: 16,
  input: 16,
  button: 18,
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 0,
    fontFamily: 'GmarketSansLight',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  headerTitle: {
    fontSize: fontSizes.header,
    fontFamily: 'GmarketSansBold',
    marginLeft: 10,
    color: colors.text,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.lightBg,
    marginBottom: 16,
    fontSize: fontSizes.input,
    fontFamily: 'GmarketSansLight',
  },
  label: {
    fontSize: fontSizes.label,
    marginBottom: 8,
    color: colors.label,
    fontFamily: 'GmarketSansLight',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: fontSizes.button,
    fontFamily: 'GmarketSansMedium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: fontSizes.label,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: colors.text,
  },
});