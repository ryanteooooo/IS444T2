import React from 'react';

import { Routes, Route } from 'react-router-dom';

// components
import Home from '../pages/Home';
import Cards from '../pages/Cards';
import Signin from '../pages/SignIn';
import Profile from '../pages/Profile';
import Savings from '../pages/Savings';
import Transactions from '../pages/Transactions';
import Exchange from '../pages/Exchange';

const Navigation = (): React.JSX.Element => (
  <Routes>
    <Route path='/' element={<Signin />} />
    <Route path='/add' element={<Home />} />
    <Route path='/home' element={<Home />} />
    <Route path='/cards' element={<Cards />} />
    <Route path='/profile' element={<Profile />} />
    <Route path='/savings' element={<Savings />} />
    <Route path='/transactions' element={<Transactions />} />
    <Route path='/exchange' element={<Exchange />} />
  </Routes>
);

export default Navigation;
