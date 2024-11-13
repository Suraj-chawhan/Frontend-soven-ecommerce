"use client"

import React from 'react';
import GooglePayButton from '@google-pay/button-react';

const GooglePay = ({price}) => {
  return (
    <div>
      <GooglePayButton
        environment="TEST"
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA'],
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  gateway: 'example',
                  gatewayMerchantId: 'your-merchant-id',
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: 'your-merchant-id',
            merchantName: 'Your Merchant Name',
          },
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: '10.00', // The total price of the items
            currencyCode: 'USD',
            countryCode: 'US',
          },
        }}
        onLoadPaymentData={(paymentData) => {
          // Process the payment data
          console.log('Payment Success', paymentData);
        }}
        onError={(error) => {
          // Handle error
          console.error('Payment Error', error);
        }}
      />
    </div>
  );
};

export default GooglePay;
