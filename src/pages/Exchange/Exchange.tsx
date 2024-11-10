import React, { useState, useEffect, useCallback } from 'react';
import './Exchange.css';
import { useAuth } from '../../AuthContext';
import { AUTH_HEADER } from '../../apiConfig';
import { useCurrency } from '../CurrencyContext'; 
import Layout from '../../components/Layout/Layout';
import Actions from '../../components/Actions/Actions';
import Divider from '../../components/Divider/Divider';

const ExchangeSection = (): React.JSX.Element => {
  const { accountID: accountId } = useAuth();
  const { setSelectedCurrency } = useCurrency(); // Use setSelectedCurrency from context
  const [activeTab, setActiveTab] = useState<'exchange' | 'limit' | 'status'>('exchange');
  const [liveRate, setLiveRate] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [localCurrency, setLocalCurrency] = useState<string>(''); // Local state for selected currency
  const [transactions, setTransactions] = useState<any[]>([]);
  const [limitOrders, setLimitOrders] = useState<any[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [balance, setBalance] = useState<string>('N/A');
  const [sgdBalance, setSgdBalance] = useState<number>(0); // State for SGD balance
  const [message, setMessage] = useState<string>(''); // State for output message
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading animation
  const [rateLocks, setRateLocks] = useState<any[]>([]); // State for rate lock transactions

  const currencies = ['USD', 'EUR', 'GBP', 'THB'];

  const fetchBalance = useCallback(async (currency: string) => {
    try {
      const response = await fetch(`https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/CurrencyBankAPI/GetSingleAccountCurrencyNew?AccountId=${accountId}`);
      const data = await response.json();
      console.log('Balance data:', data);
      const currencyData = data.Currencies.find((c: any) => c.CurrencyCode === currency);
      setBalance(currencyData ? currencyData.Amount.toFixed(2) : 'N/A');

      // Find and set the SGD balance
      const sgdData = data.Currencies.find((c: any) => c.CurrencyCode === 'SGD');
      setSgdBalance(sgdData ? sgdData.Amount : 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, [accountId]);

  const fetchLiveRate = useCallback(async (currency: string) => {
    try {
      const response = await fetch(`https://smuedu-dev.outsystemsenterprise.com/gateway/rest/marketdata/exchange_rate?baseCurrency=SGD&quoteCurrency=${currency}`, {
        headers: {
          Authorization: AUTH_HEADER,
        },
      });
      const data = await response.json();
      console.log('Live rate data:', data);

      // Set the live rate with 5 decimal places
      setLiveRate(parseFloat(Number(data.rate).toFixed(5)));  // Round to 5 decimal places and convert back to number

      // Initialize exchange rate with live rate
      setExchangeRate(parseFloat(Number(data.rate).toFixed(5)));  // Round to 5 decimal places and convert back to number

    } catch (error) {
      console.error('Error fetching live rate:', error);
    }
  }, []);

  useEffect(() => {
    if (localCurrency) {
      fetchBalance(localCurrency);
      fetchLiveRate(localCurrency);
    }
  }, [localCurrency, fetchBalance, fetchLiveRate]);

  const handleLiveExchangeSubmit = async () => {
    if (!accountId) {
      setMessage('Account ID is missing.');
      return;
    }
    if (!localCurrency) {
      setMessage('Please select a currency.');
      return;
    }
    if (!exchangeRate || exchangeRate <= 0) {
      setMessage('Please enter a valid exchange rate.');
      return;
    }
    if (!paymentAmount || paymentAmount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }
    if (paymentAmount > sgdBalance) {
      setMessage('Insufficient SGD balance for this exchange.');
      return;
    }

    setIsLoading(true); // Start loading animation
    const startTime = Date.now();

    try {
      console.log('Submitting exchange:', {
        AccountId: accountId,
        Currency: localCurrency,
        X_Rate: exchangeRate,
        Amount: paymentAmount,
      });

      const response = await fetch('https://personal-6hjam0f0.outsystemscloud.com/NewExchangeCurrencyLocker/rest/RateLockAPI/CompositeNewRateLock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_HEADER,
        },
        body: JSON.stringify({
          AccountId: accountId,
          Currency: localCurrency,
          X_Rate: exchangeRate,
          Amount: paymentAmount,
        }),
      });

      const data = await response.json();
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime); // Ensure at least 1 second delay

      setTimeout(() => {
        setIsLoading(false); // Stop loading animation
        if (response.ok) {
          setMessage('Exchange submitted successfully!');
        } else {
          setMessage('Error submitting exchange.');
        }
        console.log('Exchange submitted:', data);
      }, remainingTime);

      // Set the global currency in context after successful submission
      setSelectedCurrency(localCurrency);

    } catch (error) {
      console.error('Error submitting exchange:', error);
      setMessage('An error occurred while submitting the exchange.');
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Actions />
      <Divider />
      
      <h1>Exchange Currency</h1>
      <div>
        <label>Select Currency:</label>
        <select
          value={localCurrency}
          onChange={(e) => setLocalCurrency(e.target.value)}
        >
          <option value="" disabled>Select a currency</option>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
        />
      </div>

      <button type='button' onClick={handleLiveExchangeSubmit} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Submit Exchange'}
      </button>

      <p>{message}</p>
    </Layout>
  );
};

export default ExchangeSection;
