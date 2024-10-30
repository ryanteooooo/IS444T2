import React, { useState } from 'react';

// components
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';

const Profile = (): React.JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false); // New state for currency wallet modal

  const handleSignOut = () => {
    console.log('User signed out');
    window.location.href = 'http://localhost:3000/';
  };

  const toggleModal = () => setShowModal(!showModal);
  const toggleBalanceModal = () => setShowBalanceModal(!showBalanceModal); // Toggle function for balance modal

  return (
    <Layout>
      <Divider />

      <h1 className='title'>Profile</h1>

      <div className='account-photo' style={{ backgroundImage: `url("images/profile.jpg")` }} />

      <div className='center'>
        <h2>Thomas Tan</h2>
        <p className='flex flex-v-center flex-h-center'>@thomastan</p>
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
          Add Card
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
