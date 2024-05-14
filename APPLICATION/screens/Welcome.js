import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { View } from 'react-native';
import {
  InnerContainer,
  PageTitle,
  StyledFormArea,
  SubTitle,
  StyledButton,
  ButtonText,
  Line,
  MessageBox,
  WelcomeContainer,
  WelcomeImage,
  Avatar,
  StyledContainer,
} from '../components/Style';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//Credentials context
import { CredentialsContext } from './../components/CredentialsContext';
import { NavigationContainer } from '@react-navigation/native';

const Welcome = ({ navigation }) => {
  //context
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
  const { name, email, photoUrl } = storedCredentials;
  const AvatarImg = photoUrl ? { uri: photoUrl } : require('./../assets/img1.jpg');

  const clearLogin = () => {
    AsyncStorage.removeItem('IrrigationSystem')
      .then(() => {
        setStoredCredentials('');
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <StatusBar style="light" />
      <InnerContainer>
        <WelcomeImage resizeMode="contain" source={require('./../assets/img2.jpg')} />
        <WelcomeContainer>
          <PageTitle welcome={true}>Welcome</PageTitle>
          <SubTitle welcome={true}>{name || 'Nishan'}</SubTitle>
          <SubTitle welcome={true}>{email || 'nishan@gmail.com'} </SubTitle>
          <StyledFormArea>
            <Avatar resizeMode="cover" source={AvatarImg} />
            <MessageBox>. . .</MessageBox>
            <Line />

            <StyledButton onPress={() => navigation.navigate('Home')}>
              <ButtonText>View Field Status</ButtonText>
            </StyledButton>
            <StyledButton onPress={clearLogin}>
              <ButtonText>Logout</ButtonText>
            </StyledButton>
          </StyledFormArea>
        </WelcomeContainer>
      </InnerContainer>
    </>
  );
};

export default Welcome;
