import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';



// components
import Layout from '../../components/Layout/Layout';
import Actions from '../../components/Actions/Actions';
import Widgets from '../../components/Widgets/Widgets';
import Divider from '../../components/Divider/Divider';
import Circle from '../../components/Circle/Circle';
import './Home.css'; // Add this import statement
import Button from '../../components/Form/Button';

// interfaces
interface ICurrency {
  CurrencyCode: string;
  Amount: number;
}

interface IAccountData {
  AccountId: string;
  Currencies: ICurrency[];
}


const History = (): React.JSX.Element => {

  const {latestCurrencyChanged } = useAuth();
  // ... existing code ...

  useEffect(() => {
    console.log('Latest Currency Changed:', latestCurrencyChanged);
  }, [latestCurrencyChanged]);




  const { accountID:accountId } = useAuth();
  // const accountId = "6"; // simulate accountID
  const [activeTab, setActiveTab] = useState<'spending' | 'addPayment'>('spending');
  const [accountData, setAccountData] = useState<IAccountData | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]); // State for transactions
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const transactionsPerPage = 6;
  const [recipientAccount, setRecipientAccount] = useState<string>(''); // State for recipient account
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading animation

  useEffect(() => {
    // Fetch account data
    fetch(`https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/CurrencyBankAPI/GetSingleAccountCurrencyNew?AccountId=${accountId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched account data:', data);
        setAccountData(data);
      })
      .catch((error) => console.error('Error fetching account data:', error));
  
    // Fetch transactions when activeTab is 'spending' tab
    if (activeTab === 'spending') {
      fetch(`https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/TransactionLogAPI/GetSingleAcctTransactions?AccountId=${accountId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched transactions:', data);
          setTransactions(Array.isArray(data) ? data : []); // Set to an empty array if data is not an array
        })
        .catch((error) => console.error('Error fetching transactions:', error));
    }
  
    // Reset transactions when switching to the 'addPayment' tab to reload fresh data
    if (activeTab === 'addPayment') {
      setTransactions([]); // Clear current transactions to show fresh data
    }
  
  }, [accountId, activeTab]); // Add activeTab here to trigger fetch on tab change
  
  
  

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const formatAmount = (amount: number) => amount.toFixed(2);
  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy');
  };
  
  const formatReason = (reason: string, txn: any) => {
    if (reason.startsWith('Transfer from')) {
      const parts = reason.split(' ');
      const accountNumber = parts[4]; // Get the sender's account ID
      return `Transfer to Account: ${accountNumber}`;
    }
    
    if (reason.startsWith('Receive')) {
      const parts = reason.split(' ');
      const accountNumber = parts[2]; // Get the sender's account ID
      return `Receive from Account: ${accountNumber}`;
    }
  
    return reason;
  };
  
  

  const handleAddPayment = () => {
    if (!accountData) return;
  
    if (!selectedCurrency) {
      setMessage('Please select a currency.');
      return;
    }
  
    if (!paymentAmount || paymentAmount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }
  
    if (!recipientAccount) {
      setMessage('Please enter a recipient account number.');
      return;
    }
  
    const currency = accountData.Currencies.find((c) => c.CurrencyCode === selectedCurrency);
  
    if (currency && currency.Amount >= paymentAmount) {
      setIsLoading(true); // Start loading animation
      const startTime = Date.now();
  
      fetch('https://personal-6hjam0f0.outsystemscloud.com/TransferMoney/rest/TransferMoneyComposite/TransferMoney', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          AccountId1: accountId,
          AccountId2: recipientAccount,
          Currency: selectedCurrency,
          Amount: paymentAmount,
        }),
      })
        .then((response) => {
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 1000 - elapsedTime); // Ensure at least 1 second delay
  
          setTimeout(() => {
            setIsLoading(false); // Stop loading animation
            if (response.ok) {
              setMessage('Payment added successfully!');
            } else {
              setMessage('Error adding payment.');
            }
          }, remainingTime);
        })
        .catch((error) => {
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, 1000 - elapsedTime); // Ensure at least 1 second delay
  
          setTimeout(() => {
            setIsLoading(false); // Stop loading animation
            setMessage('Error adding payment.');
          }, remainingTime);
        });
    } else {
      setMessage('Insufficient balance for this currency.');
    }
  };

  // const handleAddPayment = () => {
  //   if (!accountData) return;
  
  //   if (!selectedCurrency) {
  //     setMessage('Please select a currency.');
  //     return;
  //   }
  
  //   if (!paymentAmount || paymentAmount <= 0) {
  //     setMessage('Please enter a valid amount.');
  //     return;
  //   }
  
  //   if (!recipientAccount) {
  //     setMessage('Please enter a recipient account number.');
  //     return;
  //   }
  
  //   const currency = accountData.Currencies.find((c) => c.CurrencyCode === selectedCurrency);
  
  //   if (currency && currency.Amount >= paymentAmount) {
  //     setIsLoading(true); // Start loading animation
  //     const startTime = Date.now();
  
  //     // Simulate API call
  //     const requestBody = {
  //       AccountId1: accountId,
  //       AccountId2: recipientAccount,
  //       Currency: selectedCurrency,
  //       Amount: paymentAmount,
  //     };
  
  //     console.log('API transfer money with body:', JSON.stringify(requestBody, null, 2));
  
  //     const elapsedTime = Date.now() - startTime;
  //     const remainingTime = Math.max(0, 1000 - elapsedTime); // Ensure at least 1 second delay
  
  //     setTimeout(() => {
  //       setIsLoading(false); // Stop loading animation
  //       setMessage('Payment added successfully!');
  //       console.log('Payment added successfully!');
  //     }, remainingTime);
  //   } else {
  //     setMessage('Insufficient balance for this currency.');
  //     console.log('Insufficient balance for this currency.');
  //   }
  // };
  
  

  return (
    <div className={`history-section ${isLoading ? 'blur' : ''}`}>
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
            className={`tab-button1 ${activeTab === 'spending' ? 'active' : ''}`}
            onClick={() => setActiveTab('spending')}
          >
            Spending History
          </button>
          <button
            type='button'
            className={`tab-button1 ${activeTab === 'addPayment' ? 'active' : ''}`}
            onClick={() => setActiveTab('addPayment')}
          >
            Send Currency
          </button>
        </div>
      </div>
  
      <Divider />
  
      <div className='history-container'>
      {activeTab === 'spending' && (
        <div className='spending-history'>
          {currentTransactions.length > 0 ? (
            currentTransactions.map((txn) => {
              let icon = 'send_money'; // Default icon
              if (txn.Reason.startsWith('Currency Exchange')) {
                icon = 'currency_exchange';
              } else if (txn.Reason.startsWith('Receive')) {
                icon = 'attach_money';
              }

              return (
                <div key={txn.TxnId} className='transaction-card'>
                  <div className='circle no-select flex flex-col flex-v-center flex-h-center'>
                    <span className='material-symbols-outlined'>{icon}</span>
                  </div>
                  <div>
                    <p>{formatReason(txn.Reason, txn)}</p>
                    <p>{formatDate(txn.DateTime)}</p>
                  </div>
                  <div>
                    <p>{txn.Currency} {formatAmount(txn.Amount)}</p>
                    {txn.X_Rate && <p>Rate: {txn.X_Rate}</p>}
                  </div>
                </div>
              );
            })
          ) : (
            <p className='no-transactions-message'>- No Transactions -</p>
          )}
          <div className='pagination-buttons'>
            <button type='button' className='paginationbutton' onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <button type='button' className='paginationbutton' onClick={nextPage} disabled={indexOfLastTransaction >= transactions.length}>
              Next
            </button>
          </div>
          <div className='pagination-info'>
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}



  
      {activeTab === 'addPayment' && (
        <>
          <div className='payment-section'>
          <div className='row' />
          <div className='row' />
            <div className='payment-grid'>
              <div className='grid-row'>
                <div className='grid-col'>
                  <select
                    className='currency-dropdown'
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                  >
                    <option value=''>Select Currency</option>
                    {accountData?.Currencies?.map((currency) => (
                      <option key={currency.CurrencyCode} value={currency.CurrencyCode}>
                        {currency.CurrencyCode}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='grid-col'>
                  <div className='amount-section'>
                    <input
                      id='paymentAmount'
                      className='amountInput'
                      value={paymentAmount !== 0 ? paymentAmount : ''}
                      type='number'
                      placeholder='Amount'
                      autoComplete='off'
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              <div className='grid-row'>
                <div className='grid-col'>
                  <span className='balance-info'>
                    Balance: {selectedCurrency ? `${accountData?.Currencies.find(c => c.CurrencyCode === selectedCurrency)?.Amount.toFixed(2) || 0}` : 'N/A'}
                  </span>
                </div>
                <div className='grid-col'>
                  <div className='recipient-section'>
                    <input
                      id='recipientAccount'
                      className='recipientInput'
                      type='number'
                      value={recipientAccount}
                      onChange={(e) => setRecipientAccount(e.target.value)}
                      placeholder='Account number'
                    />
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            <div className='submitButton'>
              <div className='add-buttons flex flex-space-between'>
                <button type='button' className='LocalButton' onClick={handleAddPayment}>
                  Send Money
                </button>
              </div>
              <div className='add-buttons'>
                {message && <p className='message'>{message}</p>}
              </div>
            </div>
            <div className='row' />
            <div className='row' />
          </div>
          <Divider />
        </>
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