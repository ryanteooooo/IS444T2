import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
    accountID: string | null;
    setAccountID: React.Dispatch<React.SetStateAction<string | null>>;
    userName: string | null;
    setUserName: React.Dispatch<React.SetStateAction<string | null>>;
    userEmail: string | null;
    setUserEmail: React.Dispatch<React.SetStateAction<string | null>>;
    userTbankAccountId: string | null;
    setTbankAccountId: React.Dispatch<React.SetStateAction<string | null>>;
    userPhoneNumber: string | null;
    setUserPhoneNumber: React.Dispatch<React.SetStateAction<string | null>>;
    latestCurrencyChanged: string | null;
    setLatestCurrencyChanged: React.Dispatch<React.SetStateAction<string | null>>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Load user data from localStorage
    const storedAccountID = localStorage.getItem('accountID');
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');
    const storedUserTbankAccountId = localStorage.getItem('userTbankAccountId');
    const storedUserPhoneNumber = localStorage.getItem('userPhoneNumber');
    const storedLatestCurrencyChanged = localStorage.getItem('latestCurrencyChanged');

    // Initialize state with values from localStorage, or default to null
    const [accountID, setAccountID] = useState<string | null>(storedAccountID);
    const [userName, setUserName] = useState<string | null>(storedUserName);
    const [userEmail, setUserEmail] = useState<string | null>(storedUserEmail);
    const [userTbankAccountId, setTbankAccountId] = useState<string | null>(storedUserTbankAccountId);
    const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(storedUserPhoneNumber);
    const [latestCurrencyChanged, setLatestCurrencyChanged] = useState<string | null>(storedLatestCurrencyChanged);

    // Update localStorage whenever state changes
    useEffect(() => {
        if (accountID) localStorage.setItem('accountID', accountID);
        else localStorage.removeItem('accountID');
        
        if (userName) localStorage.setItem('userName', userName);
        else localStorage.removeItem('userName');
        
        if (userEmail) localStorage.setItem('userEmail', userEmail);
        else localStorage.removeItem('userEmail');
        
        if (userTbankAccountId) localStorage.setItem('userTbankAccountId', userTbankAccountId);
        else localStorage.removeItem('userTbankAccountId');
        
        if (userPhoneNumber) localStorage.setItem('userPhoneNumber', userPhoneNumber);
        else localStorage.removeItem('userPhoneNumber');
        
        if (latestCurrencyChanged) localStorage.setItem('latestCurrencyChanged', latestCurrencyChanged);
        else localStorage.removeItem('latestCurrencyChanged');
    }, [accountID, userName, userEmail, userTbankAccountId, userPhoneNumber, latestCurrencyChanged]);

    const logout = () => {
        setAccountID(null);
        setUserName(null);
        setUserEmail(null);
        setTbankAccountId(null);
        setUserPhoneNumber(null);
        setLatestCurrencyChanged(null);
    };

    const value = React.useMemo(
        () => ({
            accountID,
            setAccountID,
            userName,
            setUserName,
            userEmail,
            setUserEmail,
            userTbankAccountId,
            setTbankAccountId,
            userPhoneNumber,
            setUserPhoneNumber,
            latestCurrencyChanged,
            setLatestCurrencyChanged,
            logout
        }),
        [accountID, userName, userEmail, userTbankAccountId, userPhoneNumber, latestCurrencyChanged]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
