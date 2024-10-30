import React, { useState } from 'react';

// components
import Button from '../components/Form/Button';
import Layout from '../components/Layout/Layout';
import Divider from '../components/Divider/Divider';
import DealsWidget from '../components/DealsWidget/DealsWidget';
import DealsCategory from '../components/DealsCategory/DealsCategory';

const Deals = (): React.JSX.Element => {
  // State to track selected category, default to "Flights"
  const [selectedCategory, setSelectedCategory] = useState<'Flights' | 'Hotels'>('Flights');

  return (
    <Layout>
      <Divider />

      <h1 className="title no-select">Deals</h1>

      <Divider />

      {/* Pass selectedCategory and setSelectedCategory to DealsWidget */}
      <DealsWidget selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      <Divider />

      {/* Conditionally render DealsCategory based on selected category */}
      {selectedCategory === 'Flights' && <DealsCategory category="Flights" />}
      {selectedCategory === 'Hotels' && <DealsCategory category="Hotels" />}

      <Divider />
    </Layout>
  );
};

export default Deals;
