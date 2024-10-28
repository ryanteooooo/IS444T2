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

import { AuthProvider } from './AuthContext';

const App = (): React.JSX.Element => (
    <AuthProvider>
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add" element={<Add />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/transactions" element={<Transactions />} />
        </Routes>
    </AuthProvider>
);

export default App;
