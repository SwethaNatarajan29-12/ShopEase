// src/StripeElementsContext.jsx
import React from 'react';
import { ElementsConsumer } from '@stripe/react-stripe-js';

export const StripeElementsContext = React.createContext(null);

export const StripeElementsProvider = ({ children }) => (
  <ElementsConsumer>
    {({ elements, stripe }) => {
      window.StripeElementsContext = { elements, stripe }; // quick global for demo
      return (
        <StripeElementsContext.Provider value={{ elements, stripe }}>
          {children}
        </StripeElementsContext.Provider>
      );
    }}
  </ElementsConsumer>
);
