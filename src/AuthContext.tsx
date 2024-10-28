import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    accountID: string | null;
    setAccountID: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Delete the mock accountID once able to connect to backend
    // const [accountID, setAccountID] = useState<string | null>(null);

    // Use a mock accountID in development mode
    const [accountID, setAccountID] = useState<string | null>(
        process.env.NODE_ENV === 'development' ? 'mockAccountId123' : null
    );

    // Use useMemo to prevent the value from changing on every render
    const value = React.useMemo(() => ({ accountID, setAccountID }), [accountID, setAccountID]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
