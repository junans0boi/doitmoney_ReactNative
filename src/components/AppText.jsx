// src/components/AppText.jsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const AppText = (props) => {
  // 전달된 스타일을 하나의 객체로 평탄화합니다.
  const flatStyle = StyleSheet.flatten(props.style) || {};

  // 기본 폰트를 GmarketSansLight로 설정하고,
  // fontWeight가 'bold'이면 GmarketSansBold, 
  // 또는 fontWeight가 '500' 또는 'medium'이면 GmarketSansMedium으로 설정합니다.
  let fontFamily = 'GmarketSansLight'; // 기본값
  if (flatStyle.fontWeight === 'bold') {
    fontFamily = 'GmarketSansBold';
  } else if (flatStyle.fontWeight === '500' || flatStyle.fontWeight === 'medium') {
    fontFamily = 'GmarketSansMedium';
  }

  // 최종 스타일에 fontFamily를 덮어씁니다.
  const finalStyle = [{ fontFamily }, props.style];

  return <Text {...props} style={finalStyle}>{props.children}</Text>;
};

export default AppText;