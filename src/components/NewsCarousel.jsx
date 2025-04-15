// src/components/NewsCarousel.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { api } from '../api/api';

const { width: screenWidth } = Dimensions.get('window');

export default function NewsCarousel() {
  const [newsItems, setNewsItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await api.getTodayNews();
        if (Array.isArray(data)) {
          setNewsItems(data);
        } else if (data && Array.isArray(data.newsResults)) {
          setNewsItems(data.newsResults);
        } else {
          setNewsItems([]);
        }
      } catch (error) {
        console.error('뉴스 불러오기 에러:', error);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if (newsItems.length === 0) return;
    const intervalId = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % newsItems.length);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [newsItems]);

  if (newsItems.length === 0) {
    return <Text style={{ textAlign: 'center', marginVertical: 10 }}>뉴스 로딩 중...</Text>;
  }

  const handlePressSlide = (link) => {
    // 예: Linking.openURL(link);
  };

  return (
    <View style={styles.carouselContainer}>
      {newsItems.map((item, index) => {
        const isActive = index === currentSlide;
        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.carouselSlide,
              { opacity: isActive ? 1 : 0, zIndex: isActive ? 1 : 0 },
            ]}
            onPress={() => handlePressSlide(item.link)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: item.thumbnail || 'https://via.placeholder.com/300' }}
              style={styles.slideImage}
            />
            <View style={styles.slideContent}>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideSnippet}>{item.snippet}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    overflow: 'hidden',
    backgroundColor: '#ccc',
  },
  carouselSlide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: 200,
    justifyContent: 'flex-end',
    backgroundColor: '#000',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  slideContent: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  slideTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  slideSnippet: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
});