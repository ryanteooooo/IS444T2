import React, { createContext, useContext, useState, useMemo } from 'react';

interface CurrencyContextProps {
    selectedCurrency: string;
    setSelectedCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export const CurrencyProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

    // Use useMemo to avoid re-creating the context value on every render
    const contextValue = useMemo(() => ({ selectedCurrency, setSelectedCurrency }), [selectedCurrency]);

    return (
        <CurrencyContext.Provider value={contextValue}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = (): CurrencyContextProps => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
