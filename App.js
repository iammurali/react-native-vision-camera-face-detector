// @ts-nocheck
import * as React from 'react';
import {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import {CFPaymentGatewayService} from 'react-native-cashfree-pg-sdk';
import {
  CFDropCheckoutPayment,
  CFEnvironment,
  CFPaymentComponentBuilder,
  CFPaymentModes,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';
const BASE_RESPONSE_TEXT = 'Response or error will show here.';

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'ios' ? 56 : 24,
    backgroundColor: '#eaeaea',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  button: {
    color: '#61aafb',
    margin: 8,
    width: 200,
  },
  response_text: {
    margin: 16,
    fontSize: 14,
  },
});

export default function App() {
  const [response_text, setResponseText] = React.useState(
    'Response or error will appear here',
  );

  React.useEffect(() => {
    CFPaymentGatewayService.setCallback({
      onVerify(orderID) {
        setResponseText('orderId is :' + orderID);
      },
      onError(error, orderID) {
        setResponseText(
          'exception is : ' +
            JSON.stringify(error) +
            '\norderId is :' +
            orderID,
        );
      },
    });

    return function cleanup() {
      CFPaymentGatewayService.removeCallback();
    };
  }, [response_text]);

  let startCheckout = async () => {
    console.log('Checkout starts here')
    try {
      const session = new CFSession(
        'fuN4XZKQFqBKFw55VsvB',
        '123123123',
        CFEnvironment.SANDBOX,
      );
      const paymentModes = new CFPaymentComponentBuilder()
        .add(CFPaymentModes.CARD)
        .add(CFPaymentModes.UPI)
        .add(CFPaymentModes.NB)
        .add(CFPaymentModes.WALLET)
        .add(CFPaymentModes.PAY_LATER)
        .build();
      const theme = new CFThemeBuilder()
        .setNavigationBarBackgroundColor('#E64A19')
        .setNavigationBarTextColor('#FFFFFF')
        .setButtonBackgroundColor('#FFC107')
        .setButtonTextColor('#FFFFFF')
        .setPrimaryTextColor('#212121')
        .setSecondaryTextColor('#757575')
        .build();
      const dropPayment = new CFDropCheckoutPayment(
        session,
        paymentModes,
        theme,
      );
      CFPaymentGatewayService.doPayment(dropPayment);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Button onPress={() => startCheckout()} title="Start payment" />
        <Text style={styles.response_text}>{response_text}</Text>
      </View>
    </View>
  );
}
