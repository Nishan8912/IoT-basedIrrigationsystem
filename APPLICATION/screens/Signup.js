import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { DatePickerIOSBase, View, TouchableOpacity, ActivityIndicator } from 'react-native';
//formik
import { Formik } from 'formik';
//Icons
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';
//API client
import axios from 'axios';

//verifivation
import LinkVerification from './LinkVerification';

//api route
import { baseAPIUrl } from '../components/Shared';

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
//dateTime
import DateTimePicker from '@react-native-community/datetimepicker';
//keyboard avoiding wrapper
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

//async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//Credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  // actual date of the birth to be sent
  const [dob, setDob] = useState();

  //context
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setDob(currentDate);
  };
  const showDatePicker = () => {
    setShow(true);
  };
  const handleMessage = (message, type = 'FAILED') => {
    setMessage(message);
    setMessageType(type);
  };

  const handleSignup = (credentials, setSubmitting) => {
    handleMessage(null);
    const url = `${baseAPIUrl}/user/signup`;

    axios
      .post(url, credentials)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;

        if (status !== 'SUCCESSFUL') {
          handleMessage(message, status);
        } else {
          persistLogin({ ...data }, message, status);
          // navigation.navigate('Welcome', { ...data });
        }
        setSubmitting(false);
      })
      .catch((err) => {
        // console.log(err.JSON());
        setSubmitting(false);
        handleMessage('An error occoured. Check your network and try again');
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
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageTitle>Irrigation System</PageTitle>
          <SubTitle>Account Signup</SubTitle>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )}
          <Formik
            initialValues={{ name: '', email: '', dateOfBirth: '', password: '', confirmPassword: '' }}
            onSubmit={(values, { setSubmitting }) => {
              values = { ...values, dateOfBirth: dob };
              if (
                (values.email == '' || values.password == '' || values.dateOfBirth == '' || values.name == '',
                values.confirmPassword == '')
              ) {
                handleMessage('Please fill all the fields');
                setSubmitting(false);
              } else if (values.password !== values.confirmPassword) {
                handleMessage('Password do not match');
                setSubmitting(false);
              } else {
                handleSignup(values, setSubmitting);
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Full Name"
                  icon="person"
                  placeholder="Nishan Rai"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
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
                  label="Date of Birth"
                  icon="calendar"
                  placeholder="YYY-MM-DD"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('dateOfBirth')}
                  onBlur={handleBlur('dateOfBirth')}
                  value={values.dateOfBirth}
                  value={dob ? dob.toDateString() : ''}
                  isDate={true}
                  editable={false}
                  showDatePicker={showDatePicker}
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
                <MyTextInput
                  label=" Confirm Password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MessageBox type={messageType}>{message}</MessageBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Signup</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}
                <Line />

                <ExtraView>
                  <ExtraText>Aleady have an account? </ExtraText>
                  <TextLink onPress={() => navigation.navigate('Login')}>
                    <TextLinkContent>Login</TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyledContainer>
    </KeyboardAvoidingWrapper>
  );
};
const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      {!isDate && <StyledTextInput {...props} />}
      {isDate && (
        <TouchableOpacity onPress={showDatePicker}>
          <StyledTextInput {...props} />
        </TouchableOpacity>
      )}
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darklight} />
        </RightIcon>
      )}
    </View>
  );
};

export default Signup;
