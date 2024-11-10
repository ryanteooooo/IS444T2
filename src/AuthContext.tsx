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
    userPhone: string | null;
    setUserPhone: React.Dispatch<React.SetStateAction<string | null>>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [accountID, setAccountID] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userTbankAccountId, setTbankAccountId] = useState<string | null>(null);
    const [userPhone, setUserPhone] = useState<string | null>(null);

    const logout = () => {
        setAccountID(null);
        setUserName(null);
        setUserEmail(null);
        setTbankAccountId(null);
        setUserPhone(null);
    };

    const value = React.useMemo(
        () => ({ accountID, setAccountID, userName, setUserName, userEmail, setUserEmail, userTbankAccountId, setTbankAccountId, userPhone, setUserPhone, logout }),
        [accountID, userName, userEmail, userTbankAccountId, userPhone]
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
