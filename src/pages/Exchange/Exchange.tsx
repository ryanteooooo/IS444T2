import React, { useState, useEffect } from 'react';
import './Exchange.css'; // Import the CSS file for styling

// Import authorization and API key from a configuration file
import { API_KEY, AUTH_HEADER } from '../../apiConfig';

// Components
import Layout from '../../components/Layout/Layout';
import Actions from '../../components/Actions/Actions';
import Divider from '../../components/Divider/Divider';

// Main component for the Exchange section
const ExchangeSection = (): React.JSX.Element => {
  // State variables to manage the active tab, exchange rate, selected currency, transactions, and limit orders
  const [activeTab, setActiveTab] = useState<'exchange' | 'limit' | 'history'>('exchange');
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [limitOrders, setLimitOrders] = useState<any[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number>(0); // Add state for payment amount

  // Fetch the current exchange rate from the server
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

  // Fetch the user's limit orders from the server
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

  // Fetch the user's transaction history from the server
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

  // Handle submission of a live exchange
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

  // Handle submission of a rate limit order
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

  // Handle deletion of a limit order
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
  
  // Handle updating of a limit order
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

  // Effect hook to fetch data based on the active tab
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
      {/* Tab navigation */}
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

      {/* Content for each tab */}
      <div className='exchange-container'>
        {activeTab === 'exchange' && (
        <div className='exchange-tab'>
            <h2>New Exchange</h2>
            <div className='exchange-inputs'>
            <div className='currency-row'>
                <label>SGD to:</label>
                <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className='currency-select'
                >
                <option value=''>Select currency</option>
                {/* Populate with available currencies */}
                </select>
                <span className='live-rate'>Live Rate: {exchangeRate}</span>
            </div>
            <div className='amount-row'>
                <label>Change Amount:</label>
                <input
                type='number'
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className='amount-input'
                />
                <span>=</span>
                <span className='converted-amount'>
                {paymentAmount * exchangeRate || 0}
                </span>
            </div>
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

// Main Exchange component that includes the layout and actions
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