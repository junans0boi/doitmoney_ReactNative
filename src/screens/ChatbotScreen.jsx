// src/screens/ChatbotScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userId = global.userId || 0;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    try {
      const response = await axios.post('http://doitmoney.kro.kr/ai/advisor', {
        userId,
        message: input,
      });
      const botMessage = { sender: 'bot', text: response.data };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI 어드바이저 호출 에러:', error);
      const errorMsg = { sender: 'bot', text: '죄송합니다. 조언을 가져오지 못했습니다.' };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI 재무 어드바이저</Text>
      <ScrollView style={styles.chatWindow}>
        {messages.map((msg, i) => (
          <View key={i} style={[styles.messageBubble, msg.sender === 'bot' ? styles.botMessage : styles.userMessage]}>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputArea}>
        <TextInput style={styles.input} placeholder="재무 관련 질문을 입력하세요..." value={input} onChangeText={setInput} />
        <Button title="전송" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, marginBottom: 12, textAlign: 'center' },
  chatWindow: { flex: 1, borderWidth: 1, borderColor: '#eee', marginBottom: 12, backgroundColor: '#f9f9f9', padding: 8 },
  messageBubble: { marginVertical: 4, padding: 8, borderRadius: 8, maxWidth: '80%' },
  botMessage: { backgroundColor: '#ffe0b2', alignSelf: 'flex-start' },
  userMessage: { backgroundColor: '#e0f7fa', alignSelf: 'flex-end' },
  messageText: { fontSize: 14 },
  inputArea: { flexDirection: 'row' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 4, padding: 8, marginRight: 8 },
});