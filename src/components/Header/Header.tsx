import React, {useState,useEffect} from 'react';
import './Header.css'; // Add this import statement

import { Link } from 'react-router-dom';

const Header = (): React.JSX.Element => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState<string>('');
  const accountId = "6"; // simulate accountID


  useEffect(() => {
    fetch(`https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/UserAPI/GetSingleUser?AccountId=${accountId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserName(data.Name);
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, []);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  return (
    <>
    <header className='flex flex-v-center flex-space-between'>
      <div className='header-profile flex flex-1'>
        <Link to='/profile'>
          <div className='profile-photo' style={{ backgroundImage: 'url("images/profile.jpg")' }} />
        </Link>
      </div>
      <div className='header-greeting'>
        {userName && <h1>{`${getGreeting()}, ${userName}`}</h1>}
      </div>
      {/* <div className='header-center'>
        <div className='header-search flex flex-v-center'>
          <span
            className='material-symbols-outlined no-select'
            onClick={() => {
              inputRef.current?.focus();
            }}
          >
            search
          </span>
          <input ref={inputRef} type='text' name='search' id='search' placeholder='Search' />
        </div>
      </div>
      <div className='header-buttons flex flex-1 flex-v-center flex-end'>
        <Link to='/transactions' className='header-button flex flex-v-center flex-h-center'>
          <span className='material-symbols-outlined'>equalizer</span>
        </Link>
        <Link to='/cards' className='header-button flex flex-v-center flex-h-center'>
          <span className='material-symbols-outlined'>credit_card</span>
        </Link>
      </div> */}
    </header>
    </>
  );
};

export default Header;
