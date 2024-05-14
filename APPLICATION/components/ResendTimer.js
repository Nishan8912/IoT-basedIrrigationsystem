import React from 'react';
import { ActivityIndicator } from 'react-native';
import { View } from 'react-native-web';
import { InlineGroup, InfoText, TextLinkContent, TextLink, EmphasizeText, colors } from './Style';

const { brand } = colors;

const ResendTimer = ({ activeResend, resendEmail, resendingEmail, resendStatus, timeLeft, targetTime }) => {
  return (
    <>
      <InlineGroup>
        <InfoText>Didn't receive the email?</InfoText>
        {!resendingEmail && (
          <TextLink style={{ opacity: !activeResend && 0.5 }} disabled={!activeResend} onPress={() => {}}>
            <TextLinkContent
              resendStatus={resendStatus}
              style={{
                textDecorationLine: 'underline',
              }}
            >
              {resendStatus}
            </TextLinkContent>
          </TextLink>
        )}
        {resendingEmail && (
          <TextLink disabled>
            <TextLinkContent
              resendStatus={resendStatus}
              style={{
                textDecorationLine: 'underline',
              }}
            >
              <ActivityIndicator color={brand}></ActivityIndicator>
            </TextLinkContent>
          </TextLink>
        )}
      </InlineGroup>
      {!activeResend && (
        <InfoText>
          in <EmphasizeText> {timeLeft || targetTime}</EmphasizeText> second(s)
        </InfoText>
      )}
    </>
  );
};

export default ResendTimer;
