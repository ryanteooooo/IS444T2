import React, { useState, useEffect, useCallback } from 'react';
import './Exchange.css';
import { useAuth } from '../../AuthContext';
import { AUTH_HEADER } from '../../apiConfig';
import Layout from '../../components/Layout/Layout';
import Actions from '../../components/Actions/Actions';
import Divider from '../../components/Divider/Divider';
import Currency from '../../components/Currency/Currency';

const ExchangeSection = (): React.JSX.Element => {
  const { accountID: accountId, setLatestCurrencyChanged } = useAuth();
  const [activeTab, setActiveTab] = useState<'exchange' | 'limit' | 'status'>('exchange');
  const [liveRate, setLiveRate] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [limitOrders, setLimitOrders] = useState<any[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [balance, setBalance] = useState<string>('N/A');
  const [sgdBalance, setSgdBalance] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rateLocks, setRateLocks] = useState<any[]>([]);

  const currencies = ['USD', 'EUR', 'GBP', 'THB', 'KRW'];

  const fetchBalance = useCallback(async (currency: string) => {
    try {
      const response = await fetch(`https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/CurrencyBankAPI/GetSingleAccountCurrencyNew?AccountId=${accountId}`);
      const data = await response.json();
      console.log('Balance data:', data);
      const currencyData = data.Currencies.find((c: any) => c.CurrencyCode === currency);
      setBalance(currencyData ? currencyData.Amount.toFixed(2) : 'N/A');

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

      setLiveRate(parseFloat(Number(data.rate).toFixed(5)));
      setExchangeRate(parseFloat(Number(data.rate).toFixed(5)));
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
    if (!accountId) {
      setMessage('Account ID is missing.');
      return;
    }
    if (!selectedCurrency) {
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

    setIsLoading(true);
    const startTime = Date.now();

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
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
        if (response.ok) {
          setMessage('Exchange submitted successfully!');
          setLatestCurrencyChanged(selectedCurrency); // Update the latest currency changed
        } else {
          setMessage('Error submitting exchange.');
        }
        console.log('Exchange submitted:', data);
      }, remainingTime);
    } catch (error) {
      console.error('Error submitting exchange:', error);
      setIsLoading(false);
      setMessage('Error submitting exchange.');
    }
  };

  useEffect(() => {
    if (activeTab === 'status') {
      fetch('https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/RateAPI/GetIndividualRateLock?AccountId=13')
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched rate locks:', data);
          setRateLocks(Array.isArray(data) ? data : []);
        })
        .catch((error) => console.error('Error fetching rate locks:', error));
    }
  }, [activeTab]);

  return (
    <div className={`exchange-section ${isLoading ? 'blur' : ''}`}>
      {isLoading && (
        <div className='progress-icon'>
          <span className='material-symbols-outlined' style={{ fontSize: '48px' }}>
            progress_activity
          </span>
        </div>
      )}
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
            className={`tab-button ${activeTab === 'status' ? 'active' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            Status
          </button>
        </div>
      </div>

      <Divider />

      <div className='exchange-container'>
        {activeTab === 'exchange' && (
          <div className='exchange-tab'>
            <div className='exchange-inputs'>
              <div className='row' />
              <div className='row' />
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
                <div className='col live-rate'>Live Rate: 1 SGD = {liveRate} {selectedCurrency}</div>
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
                <div className='col input-with-currency'>
                  <input
                    type='number'
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className='amount-input'
                  />
                  <span className='currency-label'>SGD</span>
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
              <div className='submit-button-container'>
                <button type='button' onClick={handleLiveExchangeSubmit} className='submit-button'>
                  Submit
                </button>
              </div>
              {message && <p className='message'>{message}</p>}
              <div className='row' />
              <div className='row' />
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div className='status-tab'>
            <ul>
              {rateLocks.map((rateLock) => (
                <li key={rateLock.RateLockTxnId}>
                  <div className='transaction-card'>
                    <div className='icon'>
                      <span className='material-symbols-outlined'>
                        {rateLock.Exchange_Status === 'Pending' ? 'preliminary' : 'check_circle'}
                      </span>
                    </div>
                    <div className='history-row'>
                      <div className='history-col' style={{ fontWeight: 'bold' }}>
                        <span className='label'>Last updated Date:</span>
                        <span className='value'>{new Date(rateLock.DateTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className='history-row'>
                      <div className='history-col'>
                        <span className='label'>Currency:</span>
                        <span className='value'>{rateLock.Currency}</span>
                      </div>
                      <div className='history-col'>
                        <span className='label'>Rate:</span>
                        <span className='value'>{rateLock.X_Rate}</span>
                      </div>
                    </div>
                    <div className='history-row'>
                      <div className='history-col'>
                        <span className='label'>Amount:</span>
                        <span className='value'>{rateLock.Amount.toFixed(2)}</span>
                      </div>
                      <div className='history-col'>
                        <span className='label'>Status:</span>
                        <span className='value'>{rateLock.Exchange_Status}</span>
                      </div>
                    </div>
                  </div>
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