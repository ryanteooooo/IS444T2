// src/components/Layout/Layout.tsx

import React from 'react';
import Header from '../Header/Header';

// interfaces
interface IProps {
  children: React.ReactNode;
  className?: string; // Optional className prop
}

const Layout = ({ children, className }: IProps): React.JSX.Element => (
  <>
    <div className={`bg ${className}`} /> {/* Apply className to the background div */}
    <div className={`content flex flex-col ${className}`}>
      <div className='container'>
        <Header />
        {children}
      </div>
    </div>
  </>
);

export default Layout;
