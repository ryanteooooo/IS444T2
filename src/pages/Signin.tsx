import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Import the Auth context

// components
import Input from '../components/Form/Input';
import Button from '../components/Form/Button';

const Signin = (): React.JSX.Element => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const { setAccountID } = useAuth();
  const navigate = useNavigate();

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setCredentials({ ...credentials, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Delete this mock login code once able to connect to backend
    if (process.env.NODE_ENV === 'development') {
      setAccountID('mockAccountId123'); 
      navigate('/home');
      return;
    }
    //

    try {
      const response = await axios.get('https://personal-6hjam0f0.outsystemscloud.com/ExchangeCurrency/rest/UserAPI/AuthenticationAPI', {
        params: {
          Email: credentials.email,
          Password: credentials.password,
        },
      });

      // Assuming a 200 OK response if login is successful
      if (response.status === 200 && response.data?.AccountId) {
        setAccountID(response.data.AccountId); // Store the AccountId in context
        navigate('/home'); // Redirect to home page on successful login
      } else {
        alert('Invalid login');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        alert('Invalid login: Incorrect email or password');
      } else {
        alert('An error occurred during login');
      }
    }
  };

  return (
    <form>
      <div className='flex flex-v-center flex-h-center h-full'>
        <div className='bg' />
        <div className='text'>
          <h1 className='text-shadow'>Wlecome 👋</h1>
          <p className='text-shadow'>Please sign in to your account or create a new account.</p>

          <form method='post' action='/' className='form' noValidate onSubmit={handleSubmit}>
            <div className='form-line'>
              <div className='label-line'>
                <label htmlFor='email' className='text-shadow' style={{ color: 'white' }}>
                  Email
                </label>
              </div>
              <Input
                required
                tabIndex={0}
                name='email'
                type='email'
                autoComplete={false}
                placeholder='Please enter your email'
              />
            </div>
            <div className='form-line'>
              <div className='label-line flex flex-h-center flex-space-between'>
                <label htmlFor='password' className='text-shadow' style={{ color: 'white' }}>
                  Password
                </label>
                <span className='text-shadow'>
                  Forgot password?
                </span>
              </div>
              <Input
                required
                tabIndex={0}
                name='password'
                type='password'
                autoComplete={false}
                placeholder='Please enter your password'
              />
            </div>
            <div className='form-line'>
              <Button type='submit' text='Sign in' tabIndex={0} />
            </div>
          </form>

          <div className='links'>
            <a href='/signup' className='text-shadow'>
              Click here if you don&apos;t have an account
            </a>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Signin;
