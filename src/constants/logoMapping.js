// src/constants/logoMapping.js

// 1) 은행/카드 목록
export const bankList = [
  'KB국민은행', '우리은행', '신한은행', '하나은행', 'NH농협은행', 'IBK기업은행',
  '케이뱅크', '카카오뱅크', '토스뱅크', 'MG새마을금고', '우체국은행', 'KDB산업은행',
  'SH수협은행', '한국씨티은행', 'SC제일은행', 'BNK부산은행', 'BNK경남은행', 'DGK대구은행',
  '신협은행', '제주은행', '전북은행', '광주은행'
];

export const cardList = [
  'KB국민카드', '삼성카드', '신한카드', '우리카드', 'IBK기업은행', '하나카드',
  '롯데카드', '현대카드', '우체국', 'NH농협카드', '카카오뱅크', '토스뱅크'
];

// 2) 은행 로고 매핑
export const bankLogos = {
  'KB국민은행': require('../../assets/banks/kb.png'),
  '우리은행': require('../../assets/banks/won.png'),
  '신한은행': require('../../assets/banks/sol.png'),
  '하나은행': require('../../assets/banks/keb.png'),
  'NH농협은행': require('../../assets/banks/nh.png'),
  'IBK기업은행': require('../../assets/banks/ibk.png'),
  '케이뱅크': require('../../assets/banks/kbank.png'),
  '카카오뱅크': require('../../assets/banks/kakao.png'),
  '토스뱅크': require('../../assets/banks/toss.png'),
  'MG새마을금고': require('../../assets/banks/mg.png'),
  '우체국은행': require('../../assets/banks/epost.png'),
  'KDB산업은행': require('../../assets/banks/kdb.png'),
  'SH수협은행': require('../../assets/banks/sh.png'),
  '한국씨티은행': require('../../assets/banks/ct.png'),
  'SC제일은행': require('../../assets/banks/sc.png'),
  'BNK부산은행': require('../../assets/banks/bnk.png'),
  'BNK경남은행': require('../../assets/banks/bnk.png'),
  'DGK대구은행': require('../../assets/banks/dgk.png'),
  '신협은행': require('../../assets/banks/cu.png'),
  '제주은행': require('../../assets/banks/sol.png'),
  '전북은행': require('../../assets/banks/jb.png'),
  '광주은행': require('../../assets/banks/jb.png'),
};

// 3) 카드 로고 매핑
export const cardLogos = {
  'KB국민카드': require('../../assets/banks/kb.png'),
  '삼성카드': require('../../assets/banks/samsung.png'),
  '신한카드': require('../../assets/banks/sol.png'),
  '우리카드': require('../../assets/banks/won.png'),
  'IBK기업은행': require('../../assets/banks/ibk.png'),
  '하나카드': require('../../assets/banks/keb.png'),
  '롯데카드': require('../../assets/banks/lotte.png'),
  '현대카드': require('../../assets/banks/hyundai.png'),
  '우체국': require('../../assets/banks/epost.png'),
  'NH농협카드': require('../../assets/banks/kb.png'),  // 필요 시 수정
  '카카오뱅크': require('../../assets/banks/kakao.png'),
  '토스뱅크': require('../../assets/banks/toss.png'),
};

// 4) 계좌 유형(accountType)에 따라 적절한 로고를 리턴해주는 함수
export function getLogo(institutionName, accountType) {
  if (accountType === 'BANK') {
    return bankLogos[institutionName] || null;
  } else if (accountType === 'CARD') {
    return cardLogos[institutionName] || null;
  }
  return null; // CASH, ETC 등은 로고가 없다고 가정
}