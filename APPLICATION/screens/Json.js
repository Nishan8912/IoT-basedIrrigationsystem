import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { ButtonText, StyledButton } from '../components/Style';
import { NavigationContainer } from '@react-navigation/native';

export default function Json({ navigation, route }) {
  return (
    <View style={{ flex: 1, margin: 20 }}>
      <WebView
        style={{ flex: 1, marginTop: 50, pointerEvents: 'none' }}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        source={{
          html: `<meta name="viewport" content="initial-scale=1.0, maximum-scale=0.8, user-scalable=no" /> <iframe width="450", height="260" style="border: 1px solid #18f0ff;" src="https://thingspeak.com/channels/1639155/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe><iframe width="450" height="260" style="border: 1px solid  #18f0ff;" src="https://thingspeak.com/channels/1639155/charts/2?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe><iframe width="450" height="260" style="border: 1px solid  #18f0ff;" src="https://thingspeak.com/channels/1639155/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>`,
        }}
      />

      <StyledButton onPress={() => navigation.navigate('Welcome')}>
        <ButtonText>Back To Home</ButtonText>
      </StyledButton>
    </View>
  );
}
