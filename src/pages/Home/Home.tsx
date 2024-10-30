import React, { useState, useEffect } from 'react';

// components
import Layout from '../../components/Layout/Layout';
import Actions from '../../components/Actions/Actions';
import Widgets from '../../components/Widgets/Widgets';
import Divider from '../../components/Divider/Divider';
import Circle from '../../components/Circle/Circle';
import './Home.css'; // Add this import statement

// interfaces
interface ICurrency {
  CurrencyCode: string;
  Amount: number;
}

interface IAccountData {
  AccountId: string;
  Currencies: ICurrency[];
}

// Local Button Component
const LocalButton: React.FC<{ onClick: () => void; text: string }> = ({ onClick, text }) => (
  <button type='button' onClick={onClick} className='button-class'>
    {text}
  </button>
);

const History = (): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState<'spending' | 'addPayment'>('spending');
  const [accountData, setAccountData] = useState<IAccountData | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('/GetSingleAccountCurrencyNew')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched account data:', data);
        setAccountData(data);
      })
      .catch((error) => console.error('Error fetching account data:', error));
  }, []);

  const handleAddPayment = () => {
    if (!accountData) return;

    const currency = accountData.Currencies.find((c) => c.CurrencyCode === selectedCurrency);
    console.log('Selected currency:', currency);

    if (currency && currency.Amount >= paymentAmount) {
      setMessage('Payment added successfully!');
      console.log('Payment added successfully!');
    } else {
      setMessage('Insufficient balance for this currency.');
      console.log('Insufficient balance for this currency.');
    }
  };

  return (
    <div className='history-section'>
      <div className='tabs flex flex-space-between'>
        <div className='rectangle no-select flex flex-space-between'>
          <button
            type='button'
            className={`tab-button ${activeTab === 'spending' ? 'active' : ''}`}
            onClick={() => setActiveTab('spending')}
          >
            Spending History
          </button>
          <button
            type='button'
            className={`tab-button ${activeTab === 'addPayment' ? 'active' : ''}`}
            onClick={() => setActiveTab('addPayment')}
          >
            Add Payment
          </button>
        </div>
      </div>

      <Divider />

      <div className='history-container'>
        {activeTab === 'spending' && (
          <div className='spending-history'>
            {accountData?.Currencies.map((currency) => (
              <div key={currency.CurrencyCode} className='history-line flex flex-v-center'>
                <Circle color='blue' icon='currency' />
                <span className='currency-code'>{currency.CurrencyCode}</span>
                <span className='currency-amount'>{currency.Amount}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'addPayment' && (
          <div className='add-payment'>
            <div className='accounts flex flex-v-center flex-space-between'>
              <div className='account-balance'>
                <div className='flex flex-v-center no-select pointer'>

                  {/* user seletc currency here */}
                  <span>{selectedCurrency || 'Select Currency'}</span> 
                  <span className='material-symbols-outlined'>keyboard_arrow_down</span>
                </div>

                {/* user selected currency balance */}
                <span className='account-balance-bottom'>
                  Balance: {selectedCurrency ? `€ ${accountData?.Currencies.find(c => c.CurrencyCode === selectedCurrency)?.Amount || 0}` : 'N/A'}
                </span>
              </div>
              <div className='account-money flex flex-col right'>
                <div className='flex flex-v-center flex-end'>

                  {/* user key in amount */}
                  <input
                    tabIndex={0}
                    className='account-balance-input'
                    value={paymentAmount}
                    type='number'
                    placeholder='0'
                    autoComplete='off'
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    maxLength={5} // Limit input to 5 digits
                  />
                </div>
              </div>
            </div>
            <Divider />
            <div className='add-buttons flex flex-space-between'>
              <LocalButton onClick={handleAddPayment} text='Add money securely' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Home = (): React.JSX.Element => (
  <Layout>
    <Divider />

    <Actions />

    <Divider />

    <History />

    <Divider />
  </Layout>
);

export default Home;