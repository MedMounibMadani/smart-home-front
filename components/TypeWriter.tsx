import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface TypewriterProps {
  text: string;
  speed?: number;
  style?: TextStyle;
}

const TypeWriter: React.FC<TypewriterProps> = ({ text, speed = 100, style }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <ThemedText type="title" style={style} > {displayedText} </ThemedText>;
};

export default TypeWriter;
