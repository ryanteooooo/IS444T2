import React, { useState, useEffect } from 'react';
import './Exchange.css'; // Import the new CSS file

// Import authorization and API key
import { API_KEY, AUTH_HEADER } from '../apiConfig';

// Components
import Layout from '../components/Layout/Layout';
import Actions from '../components/Actions/Actions';
import Divider from '../components/Divider/Divider';

const ExchangeSection = (): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState<'exchange' | 'limit' | 'history'>('exchange');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [limitOrders, setLimitOrders] = useState<any[]>([]);


  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('/exchange_rate', {
        headers: {
          Authorization: AUTH_HEADER,
          'x-api-key': API_KEY,
        },
      });
      const data = await response.json();
      console.log('Fetched exchange rate:', data);
      setExchangeRate(data.rate);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  const fetchLimitOrders = async () => {
    try {
      const response = await fetch('/GetIndividualRateLock', {
        headers: {
          Authorization: AUTH_HEADER,
          'x-api-key': API_KEY,
        },
      });
      const data = await response.json();
      console.log('Fetched limit orders:', data);
      setLimitOrders(data.orders);
    } catch (error) {
      console.error('Error fetching limit orders:', error);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const response = await fetch('/GetAllTransactions', {
        headers: {
          Authorization: AUTH_HEADER,
          'x-api-key': API_KEY,
        },
      });
      const data = await response.json();
      console.log('Fetched transaction history:', data);
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  };

  const handleLiveExchangeSubmit = async () => {
    try {
      const response = await fetch('/AddAccountNewCurrency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_HEADER,
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({
          currency: selectedCurrency,
          rate: exchangeRate,
        }),
      });
      const data = await response.json();
      console.log('Live exchange submitted:', data);
    } catch (error) {
      console.error('Error submitting live exchange:', error);
    }
  };

  const handleRateLimitSubmit = async () => {
    try {
      const response = await fetch('/CreateRateLock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_HEADER,
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({
          currency: selectedCurrency,
          rate: exchangeRate,
        }),
      });
      const data = await response.json();
      console.log('Rate limit submitted:', data);
    } catch (error) {
      console.error('Error submitting rate limit:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/DeleteRateLock/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: AUTH_HEADER,
          'x-api-key': API_KEY,
        },
      });
      const data = await response.json();
      console.log('Order deleted:', data);
      fetchLimitOrders(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };
  
  const handleUpdateOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/UpdateRateLockStatus/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_HEADER,
          'x-api-key': API_KEY,
        },
        body: JSON.stringify({
          // Include necessary data for update
        }),
      });
      const data = await response.json();
      console.log('Order updated:', data);
      fetchLimitOrders(); // Refresh the list after update
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'exchange') {
      fetchExchangeRate();
    } else if (activeTab === 'limit') {
      fetchLimitOrders();
    } else if (activeTab === 'history') {
      fetchTransactionHistory();
    }
  }, [activeTab]);

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
            className={`tab-button ${activeTab === 'limit' ? 'active' : ''}`}
            onClick={() => setActiveTab('limit')}
          >
            Limit
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
            <h2>New Exchange</h2>
            <div className='exchange-inputs'>
              <label>SGD to:</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className='currency-select'
              >
                <option value=''>Select currency</option>
                {/* Populate with available currencies */}
              </select>
              <label>Exchange Rate:</label>
              <input
                type='number'
                value={exchangeRate}
                onChange={(e) => setExchangeRate(Number(e.target.value))}
                className='rate-input'
              />
              <button type='button' onClick={handleLiveExchangeSubmit} className='submit-button'>
                Submit Live Exchange
              </button>
              <button type='button' onClick={handleRateLimitSubmit} className='submit-button'>
                Submit Rate Limit
              </button>
            </div>
          </div>
        )}

        {activeTab === 'limit' && (
          <div className='limit-tab'>
            <h2>Exchange Limit Orders</h2>
            <ul>
              {limitOrders.map((order) => (
                <li key={order.id}>
                  {order.currency} at {order.rate}
                  <button type='button' onClick={() => handleDeleteOrder(order.id)}>Delete</button>
                  <button type='button' onClick={() => handleUpdateOrder(order.id)}>Update</button>
                </li>
              ))}
            </ul>
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