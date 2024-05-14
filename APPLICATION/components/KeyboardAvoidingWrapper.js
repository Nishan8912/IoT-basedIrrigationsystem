import React from 'react';

//keyboard avoiding view
import { KeyboardAvoidingView, ScrollView, TouchableNativeFeedback, Keyboard } from 'react-native';

import { colors } from './../components/Style';
const { primary } = colors;

const KeyboardAvoidingWrapper = ({ children }) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: primary }}>
      <ScrollView>
        <TouchableNativeFeedback onPress={Keyboard.dismiss}>{children}</TouchableNativeFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;
