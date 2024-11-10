import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

// components
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const Profile = (): React.JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<{ CurrencyCode: string; Amount: number }[]>([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [tbankAccountId, setTbankAccountId] = useState<string | null>(null);
  const [loadingTbankAccount, setLoadingTbankAccount] = useState(false);
  const [linkStatusMessage, setLinkStatusMessage] = useState<string | null>(null);

  const { accountID } = useAuth();

  const fetchTbankAccountId = async () => {
    if (!accountID) {
      console.error('Account ID is not set');
      return;
    }

    const accountIdInt = parseInt(accountID, 10);
    if (Number.isNaN(accountIdInt)) {
      console.error('Invalid AccountID: must be a number');
      return;
    }

    setLoadingTbankAccount(true);
    setLinkStatusMessage(null); // Reset message when re-fetching
    try {
      const response = await axios.get(
        `https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/UserAPI/LinkTbankAccountAPI?AccountId=${accountIdInt}`
      );
      setTbankAccountId(response.data.TbankAccountId || 'Not available');
      setLinkStatusMessage('Successfully linked!');
    } catch (error) {
      console.error('Error fetching TbankAccountId:', error);
      setLinkStatusMessage('Failed to Link');
    } finally {
      setLoadingTbankAccount(false);
    }
  };

  const toggleModal = async () => {
    setShowModal(!showModal);
    if (!showModal) {
      await fetchTbankAccountId(); // Fetch TbankAccountId when opening the modal
    }
  };

  const toggleBalanceModal = () => {
    setShowBalanceModal(!showBalanceModal);
  };

  useEffect(() => {
    const fetchUserName = async () => {
      if (!accountID) {
        console.error('Account ID is not set');
        return;
      }

      const accountIdInt = parseInt(accountID, 10);
      if (Number.isNaN(accountIdInt)) {
        console.error('Invalid AccountID: must be a number');
        return;
      }

      try {
        const response = await axios.get(
          `https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/UserAPI/GetSingleUser?AccountId=${accountIdInt}`
        );
        setUserName(response.data.Name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserName();
  }, [accountID]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      if (!accountID) {
        console.error('Account ID is not set');
        return;
      }

      const accountIdInt = parseInt(accountID, 10);
      if (Number.isNaN(accountIdInt)) {
        console.error('Invalid AccountID: must be a number');
        return;
      }

      try {
        const response = await axios.get(
          `https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/CurrencyBankAPI/GetSingleAccountCurrencyNew?AccountId=${accountIdInt}`
        );
        setCurrencies(response.data.Currencies || []);
      } catch (error) {
        console.error('Error fetching currency data:', error);
      } finally {
        setLoadingCurrencies(false);
      }
    };

    fetchCurrencies();
  }, [accountID]);

  const handleSignOut = () => {
    console.log('User signed out');
    window.location.href = 'http://localhost:3000/';
  };

  // Helper function to get the currency symbol
  const getCurrencySymbol = (currencyCode: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      SGD: 'S$',
      AUD: 'A$',
      THB: '฿',
    };
    return symbols[currencyCode] || '';
  };

  return (
    <Layout>
      <div
        onClick={() => window.history.back()}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
        className='account-link'
      >
        <span className='material-symbols-outlined'>arrow_back</span>
        <span style={{ marginLeft: '5px' }}>Back</span>
      </div>

      <Divider />

      <h1 className='title'>Profile</h1>

      <div className='account-photo' style={{ backgroundImage: `url("images/profile.jpg")` }} />

      <div className='center'>
        <h2>{userName}</h2>
      </div>

      <div className='balance-display' onClick={toggleBalanceModal} style={{ cursor: 'pointer' }}>
        <span className='material-symbols-outlined'>account_balance_wallet</span>
        <div className='balance-info'>
          <h2>Current Balance</h2>
          <h1 className='balance-amount'>$SGD 650.80</h1>
        </div>
      </div>

      <Divider />

      <div className='account'>
        <div
          onClick={toggleModal}
          className='flex flex-v-center account-link'
          style={{ cursor: 'pointer' }}
        >
          <span className='material-symbols-outlined'>credit_card</span>
          Link Account to Bank
        </div>
      </div>

      <Divider />

      <div className='account'>
        <div
          onClick={handleSignOut}
          className='flex flex-v-center account-link'
          style={{ cursor: 'pointer' }}
        >
          <span className='material-symbols-outlined'>power_settings_new</span>
          Sign Out
        </div>
      </div>

      <Divider />

      <footer className='center no-select'>
        v.1.0.12
        <br />
        Banking Ltd.
      </footer>

      <Divider />

      {showModal && (
        <div className='modal-overlay'>
          <div className='modal-content' style={{ color: '#000' }}> {/* Setting default text color */}
            <h2>Link Account to Bank</h2>
            {loadingTbankAccount ? (
              <p>Loading Tbank Account ID...</p>
            ) : (
              <>
                <p style={{ color: '#000' }}> {/* Black text for account ID */}
                  Tbank Account ID: {tbankAccountId}
                </p>
                <p style={{ color: linkStatusMessage === 'Successfully linked!' ? '#28a745' : '#dc3545' }}>
                  {linkStatusMessage}
                </p>
              </>
            )}
            <button type='button' onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      )}

      {showBalanceModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2>Your Currency Wallets</h2>
            <ul>
              {loadingCurrencies && <li>Loading...</li>}
              {!loadingCurrencies &&
                currencies.length > 0 &&
                currencies.map((currency) => (
                  <li key={currency.CurrencyCode}>
                    {currency.CurrencyCode} Wallet: {getCurrencySymbol(currency.CurrencyCode)}
                    {currency.Amount.toFixed(2)}
                  </li>
                ))}
              {!loadingCurrencies && currencies.length === 0 && (
                <li>No currencies found for your account.</li>
              )}
            </ul>

            <button type='button' onClick={toggleBalanceModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Profile;