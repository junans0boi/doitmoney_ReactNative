// src/components/common/FormPicker.jsx
import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { commonStyles } from '../../styles/commonStyles';

export const FormPicker = (props) => (
  <Picker 
    style={[commonStyles.input, props.style]} 
    {...props}
  />
);

// Picker.Item도 함께 export하도록 합니다.
FormPicker.Item = Picker.Item;