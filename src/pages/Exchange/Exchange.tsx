import React, { useState, useEffect, useCallback } from 'react';
import './Exchange.css';
import { useAuth } from '../../AuthContext';
import { AUTH_HEADER } from '../../apiConfig';
import Layout from '../../components/Layout/Layout';
import Actions from '../../components/Actions/Actions';
import Divider from '../../components/Divider/Divider';

const ExchangeSection = (): React.JSX.Element => {
  const { accountID: accountId } = useAuth();
  const [activeTab, setActiveTab] = useState<'exchange' | 'limit' | 'history'>('exchange');
  const [liveRate, setLiveRate] = useState<number>(0); // Separate state for live rate
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [limitOrders, setLimitOrders] = useState<any[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [balance, setBalance] = useState<string>('N/A');

  const currencies = ['USD', 'MYR', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'THB'];

  const fetchBalance = useCallback(async (currency: string) => {
    try {
      const response = await fetch(`https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/CurrencyBankAPI/GetSingleAccountCurrencyNew?AccountId=${accountId}`);
      const data = await response.json();
      console.log('Balance data:', data);
      const currencyData = data.Currencies.find((c: any) => c.CurrencyCode === currency);
      setBalance(currencyData ? currencyData.Amount.toFixed(2) : 'N/A');
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
      setLiveRate(data.rate);
      setExchangeRate(data.rate); // Initialize exchange rate with live rate
    } catch (error) {
      console.error('Error fetching live rate:', error);
    }
  }, []);

  useEffect(() => {
    if (selectedCurrency) {
      fetchBalance(selectedCurrency);
      fetchLiveRate(selectedCurrency);
    }
  }, [selectedCurrency, fetchBalance, fetchLiveRate]);

  const handleLiveExchangeSubmit = async () => {
    try {
      console.log('Submitting exchange:', {
        AccountId: accountId,
        Currency: selectedCurrency,
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
          Currency: selectedCurrency,
          X_Rate: exchangeRate,
          Amount: paymentAmount,
        }),
      });
      const data = await response.json();
      console.log('Exchange submitted:', data);
    } catch (error) {
      console.error('Error submitting exchange:', error);
    }
  };

  return (
    <div className='exchange-section'>
      <div className='tabs flex flex-space-between'>
        <div className='rectangle no-select flex flex-space-between'>
          <button
            type='button'
            className={`tab-button ${activeTab === 'exchange' ? 'active' : ''}`}
            onClick={() => setActiveTab('exchange')}
          >
            Exchange
          </button>
          <button
            type='button'
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
      </div>

      <Divider />

      <div className='exchange-container'>
        {activeTab === 'exchange' && (
          <div className='exchange-tab'>
            <div className='exchange-inputs'>
              <div className='row'>
                <div className='col'>Select Currency:</div>
                <div className='col'>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className='currency-select'
                  >
                    <option value=''>Select currency</option>
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='s-row'>
                <div className='col balance'>Balance: {balance}</div>
                <div className='col live-rate'>Live Rate: {liveRate}</div>
              </div>
              <div className='row' />
              <div className='row'>
                <div className='col'>Exchange Rate:</div>
                <div className='col'>
                  <input
                    type='number'
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(Number(e.target.value))}
                    className='rate-input-edit'
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col'>Change Amount:</div>
                <div className='col'>
                  <input
                    type='number'
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className='amount-input'
                  />
                </div>
              </div>
              <div className='row' />
              <div className='row'>
                <div className='col'>Estimated Amount:</div>
                <div className='col'>
                  <span className='converted-amount'>
                    {(paymentAmount * exchangeRate).toFixed(2)}
                  </span>
                </div>
              </div>
              <button type='button' onClick={handleLiveExchangeSubmit} className='submit-button'>
                Submit
              </button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className='history-tab'>
            <h2>Exchange History</h2>
            <ul>
              {transactions.map((transaction) => (
                <li key={transaction.id}>
                  {transaction.currency} - {transaction.amount} at {transaction.rate}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const Exchange = (): React.JSX.Element => (
  <Layout>
    <Divider />
    <Actions />
    <Divider />
    <ExchangeSection />
    <Divider />
    <Divider />
  </Layout>
);

export default Exchange;