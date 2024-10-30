import React from 'react';
// import { MdFlight, MdHotel } from 'react-icons/md';

interface DealsWidgetProps {
  selectedCategory: 'Flights' | 'Hotels';
  setSelectedCategory: (category: 'Flights' | 'Hotels') => void;
}

const DealsWidget = ({ selectedCategory, setSelectedCategory }: DealsWidgetProps): React.JSX.Element => (
  <div className="deals-widget flex items-center justify-center bg-primary text-primary-foreground p-2 rounded-full">
    <span
      className={`deal-cylinder flex items-center ${selectedCategory === 'Flights' ? 'active' : ''}`}
      onClick={() => setSelectedCategory('Flights')}
    >
      {/* <MdFlight className="w-5 h-5" /> */}
      <span className="font-medium">Flights</span>
    </span>
    <span
      className={`deal-cylinder flex items-center ${selectedCategory === 'Hotels' ? 'active' : ''}`}
      onClick={() => setSelectedCategory('Hotels')}
    >
      {/* <MdHotel className="w-5 h-5" /> */}
      <span className="font-medium">Hotels</span>
    </span>

  </div>
);

export default DealsWidget;
