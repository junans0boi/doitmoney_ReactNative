// src/screens/ChartScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChartScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>여기에 차트를 구현할 공간입니다.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  text: { fontSize: 16 },
});

export default ChartScreen;