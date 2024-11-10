import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Signin from './pages/Signin';
import SignUp from './pages/SignUp';
import Home from './pages/Home/Home';
import Add from './pages/Add';
import Cards from './pages/Cards';
import Profile from './pages/Profile';
import Savings from './pages/Savings';
import Transactions from './pages/Transactions';
import Deals from './pages/Deals';
import Recommendation from './pages/Recommendation/Recommendation';
import Exchange from './pages/Exchange/Exchange';
import { CurrencyProvider } from './pages/CurrencyContext';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

const App = (): React.JSX.Element => (
  <AuthProvider>
    <CurrencyProvider> {/* Moved outside of <Routes> */}
      <Routes>
        <Route path='/' element={<Signin />} />
        <Route path='/signup' element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<Home />} />
          <Route path='/add' element={<Add />} />
          <Route path='/cards' element={<Cards />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/savings' element={<Savings />} />
          <Route path='/transactions' element={<Transactions />} />
          <Route path='/deals' element={<Deals />} />
          <Route path='/recommendation' element={<Recommendation />} />
          <Route path='/exchange' element={<Exchange />} />
        </Route>
      </Routes>
    </CurrencyProvider>
  </AuthProvider>
);

export default App;
