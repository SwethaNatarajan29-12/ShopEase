// src/StripeElementsContext.jsx
import React, { createContext } from 'react';
import { ElementsConsumer } from '@stripe/react-stripe-js';

const StripeElementsContext = createContext(null);

const StripeElementsProvider = ({ children }) => (
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

export { StripeElementsContext, StripeElementsProvider };
