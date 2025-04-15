// src/screens/HomeScene.styles.js
import { StyleSheet } from 'react-native';
import { colors, fontSizes } from '../styles/commonStyles';

export default StyleSheet.create({
  contentContainer: {
    paddingBottom: 50,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  notLoggedIn: {
    alignItems: 'center',
    marginTop: 50,
  },
  assetCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 16,
    // elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  assetHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  assetHeaderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  assetAmountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  assetListRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  assetItem: {
    alignItems: 'center',
    width: 90,
  },
  assetLogo: {
    width: 40,
    height: 40,
    marginBottom: 4,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  defaultLogo: {
    width: 40,
    height: 40,
    marginBottom: 4,
    borderRadius: 20,
    backgroundColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultLogoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  assetBalance: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
    textAlign: 'center',
  },
  assetMask: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  assetTabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  tabButton: {
    padding: 4,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#f74d4d',
  },
  tabDivider: {
    marginHorizontal: 8,
    color: '#ccc',
    fontWeight: 'bold',
  },
  selectButton: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectButtonText: {
    fontSize: 12,
    color: '#333',
  },
  quickMenuContainer: {

    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  quickMenuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  quickMenuIcon: {
    marginBottom: 6,
  },
  quickMenuLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickMenuItemEmpty: {
    width: 60,
  },
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
    marginRight: 8,
  },
  modalConfirmButton: {
    marginTop: 16,
    backgroundColor: '#f74d4d',
    paddingVertical: 10,
    borderRadius: 6,
  },
  modalConfirmButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});