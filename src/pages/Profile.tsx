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

  const { accountID } = useAuth(); // Access accountID from AuthContext

  useEffect(() => {
    // Fetch user data when accountID changes
    const fetchUserName = async () => {
      if (!accountID) {
        console.error('Account ID is not set');
        return;
      }

      const accountIdInt = parseInt(accountID, 10); // Convert accountID to an integer
      if (Number.isNaN(accountIdInt)) {
        console.error('Invalid AccountID: must be a number');
        return;
      }

      try {
        const response = await axios.get(
          `https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/UserAPI/GetSingleUser?AccountId=${accountIdInt}`
        );
        setUserName(response.data.Name); // Set the user name from the API response
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserName();
  }, [accountID]);

  const handleSignOut = () => {
    console.log('User signed out');
    window.location.href = 'http://localhost:3000/';
  };

  const toggleModal = () => setShowModal(!showModal);
  const toggleBalanceModal = () => setShowBalanceModal(!showBalanceModal);

  return (
    <Layout>
      <Divider />

      <h1 className='title'>Profile</h1>

      <div className='account-photo' style={{ backgroundImage: `url("images/profile.jpg")` }} />

      <div className='center'>
        <h2>{userName}</h2>
      </div>

      {/* Current Balance section with onClick to show currency wallets */}
      <div className='balance-display' onClick={toggleBalanceModal} style={{ cursor: 'pointer' }}>
        <span className='material-symbols-outlined'>account_balance_wallet</span>
        <div className='balance-info'>
          <h2>Current Balance</h2>
          <h1 className='balance-amount'>$SGD 650.80</h1> {/* Mock value */}
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

      {/* Add Card Modal */}
      {showModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2>Add Bank Card</h2>
            <form>
              <label>Card Number:</label>
              <input type='text' placeholder='1234 5678 9012 3456' />

              <label>Expiry Date:</label>
              <input type='text' placeholder='MM/YY' />

              <label>CVV:</label>
              <input type='text' placeholder='123' />

              <button type='button' onClick={toggleModal}>
                Close
              </button>
              <button type='submit'>Add Card</button>
            </form>
          </div>
        </div>
      )}

      {/* Currency Wallet Modal */}
      {showBalanceModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2>Your Currency Wallets</h2>
            <ul>
              <li>EUR Wallet: €650.80</li>
              <li>GBP Wallet: £550.60</li>
              <li>USD Wallet: $700.50</li>
              {/* Add more wallets as needed */}
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