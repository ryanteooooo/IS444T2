import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Add from './pages/Add';
import Cards from './pages/Cards';
import Profile from './pages/Profile';
import Savings from './pages/Savings';
import Transactions from './pages/Transactions';
import Deals from './pages/Deals';
import Recommendation from './pages/Recommendation';
import Exchange from './pages/Exchange';

import { AuthProvider } from './AuthContext';

const App = (): React.JSX.Element => (
  <AuthProvider>
    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/home' element={<Home />} />
      <Route path='/add' element={<Add />} />
      <Route path='/cards' element={<Cards />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/savings' element={<Savings />} />
      <Route path='/transactions' element={<Transactions />} />
      <Route path='/deals' element={<Deals />} />
      <Route path='/recommendation' element={<Recommendation />} />
      <Route path='/exchange' element={<Exchange />} />
    </Routes>
  </AuthProvider>
);

export default App;
