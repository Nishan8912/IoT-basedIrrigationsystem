import { Center } from 'native-base';
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { ButtonText, PageTitle, StyledButton, SubTitle } from '../components/Style';

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, margin: 20 }}>
      <WebView
        style={{ flex: 1, marginTop: 60, pointerEvents: 'none' }}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        source={{
          html: `<meta name="viewport" content="initial-scale=1.0, maximum-scale=0.677,user-scalable=no" /><h2 style="color: #12d1f3; font-weight: "bold">Moisture</h2><iframe width="450" height="260" style="border: 1px solid #f6f8f8" src="https://thingspeak.com/channels/1639155/widgets/412523"></iframe>
          <h2 style="color: #12d1f3; font-weight: "bold">Temperature</h2><iframe width="450" height="260" style="border: 1px solid #fffdfd;" src="https://thingspeak.com/channels/1639155/widgets/415720"></iframe>
          <h2 style="color: #12d1f3; font-weight: "bold">Humidity</h2><iframe width="450" height="260" style="border: 1px solid #fbffff;" src="https://thingspeak.com/channels/1639155/widgets/416157"></iframe> 
          `,
        }}
      />

      <StyledButton onPress={() => navigation.navigate('Json')}>
        <ButtonText>Visualize Charts</ButtonText>
      </StyledButton>
    </View>
  );
}
