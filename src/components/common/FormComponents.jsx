// src/components/common/FormComponents.jsx
import React from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import { commonStyles } from '../../styles/commonStyles';

export const FormLabel = ({ children, style }) => (
  <Text style={[commonStyles.label, style]}>{children}</Text>
);

export const FormInput = (props) => (
  <TextInput 
    style={[commonStyles.input, props.style]} 
    {...props} 
  />
);

export const FormButton = ({ title, onPress, style, textStyle }) => (
  <TouchableOpacity style={[commonStyles.button, style]} onPress={onPress}>
    <Text style={[commonStyles.buttonText, textStyle]}>{title}</Text>
  </TouchableOpacity>
);