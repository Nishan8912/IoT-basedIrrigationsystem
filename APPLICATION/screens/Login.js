import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { DatePickerIOSBase, View, ActivityIndicator } from 'react-native';
//formik
import { Formik } from 'formik';
//Icons
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';
//API client
import axios from 'axios';

import {
  StyledContainer,
  InnerContainer,
  Pagelogo,
  PageTitle,
  StyledFormArea,
  SubTitle,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  colors,
  StyledButton,
  ButtonText,
  Line,
  MessageBox,
  ExtraText,
  TextLink,
  TextLinkContent,
  ExtraView,
} from '../components/Style';
//colors
const { brand, darklight, primary } = colors;
//keyboard avoiding wrapper
import KeyboardAvoidingwrapper from '../components/KeyboardAvoidingWrapper';

import * as Google from 'expo-google-app-auth';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//Credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const Login = ({ navigation, route }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  //context
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  const handleLogin = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = 'https://whispering-savannah-89200.herokuapp.com/user/signin';

    axios
      .post(url, credentials)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status !== 'SUCCESSFUL') {
          handleMessage(message, status);
        } else {
          // navigation.navigate('Welcome');
          persistLogin({ ...data[0] }, message, status);
        }
        setSubmitting(false);
      })
      .catch((err) => {
        console.log(err.JSON());
        setSubmitting(false);
        handleMessage('An error occoured. Check your network and try again');
      });
  };
  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

  const handleGoogleSignin = () => {
    setGoogleSubmitting(true);
    const config = {
      androidClientId: '829549050792-dav2eodnblsutle9ki3q6k54sil3bfed.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    };
    Google.logInAsync(config)
      .then((result) => {
        const { type, user } = result;
        if (type == 'success') {
          const { email, name, photoUrl } = user;
          persistLogin({ email, name, photoUrl }, message, 'success');
        } else {
          handleMessage('Google signin was cancelled');
        }
        setGoogleSubmitting(false);
      })
      .catch((err) => {
        console.log(err);
        handleMessage('An error occoured. Check your network and try again');
        setGoogleSubmitting(false);
      });
  };

  const persistLogin = (credentials, message, status) => {
    AsyncStorage.setItem('IrrigationSystem', JSON.stringify(credentials))
      .then(() => {
        handleMessage(message, status);
        setStoredCredentials(credentials);
      })
      .catch((err) => {
        console.log(err);
        handleMessage('Persisting Login Failed');
      });
  };
  return (
    <KeyboardAvoidingwrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <Pagelogo resizeMode="cover" source={require('./../assets/img1.jpg')} />
          <PageTitle>Irrigation System</PageTitle>
          <SubTitle>Account Login</SubTitle>
          <Formik
            initialValues={{ email: route?.params?.email, password: '' }}
            enableReinitialize={true}
            onSubmit={(values, { setSubmitting }) => {
              if (values.email == '' || values.password == '') {
                handleMessage('Please fill all the fields');
                setSubmitting(false);
              } else {
                handleLogin(values, setSubmitting);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Email Address"
                  icon="mail"
                  placeholder="nishan@gmail.com"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardTypes="email- address"
                />
                <MyTextInput
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MessageBox type={messageType}>{message}</MessageBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}

                <Line />

                {!googleSubmitting && (
                  <StyledButton google={true} onPress={handleGoogleSignin}>
                    <Fontisto name="google" color={primary} size={25} />
                    <ButtonText google={true}>Sign in with Google</ButtonText>
                  </StyledButton>
                )}

                {googleSubmitting && (
                  <StyledButton google={true} disabled={true}>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}

                <ExtraView>
                  <ExtraText>Don't have account already? </ExtraText>
                  <TextLink onPress={() => navigation.navigate('Signup')}>
                    <TextLinkContent>Signup</TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingwrapper>
  );
};
const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darklight} />
        </RightIcon>
      )}
    </View>
  );
};

export default Login;
