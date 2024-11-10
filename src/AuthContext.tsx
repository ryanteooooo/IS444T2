import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    const [accountID, setAccountID] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userTbankAccountId, setTbankAccountId] = useState<string | null>(null);
    const [userPhoneNumber, setUserPhoneNumber] = useState<string | null>(null);
    const [latestCurrencyChanged, setLatestCurrencyChanged] = useState<string | null>(null);

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