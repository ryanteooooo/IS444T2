import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const Actions = (): React.JSX.Element => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear the auth context
    navigate('/'); // Redirect to the login page
  };

  return (
    <div className='actions flex flex-v-center flex-h-center'>
      <div className='circle no-select flex flex-col flex-v-center flex-h-center'>
        <Link to='/home' className='flex flex-v-center flex-h-center'>
          <span className='material-symbols-outlined'>add</span>
        </Link>
        <span className='text-shadow'>Add Spending</span>
      </div>
      <div className='circle no-select flex flex-col flex-v-center flex-h-center'>
        <Link to='/exchange' className='flex flex-v-center flex-h-center'>
          <span className='material-symbols-outlined'>sync</span>
        </Link>
        <span className='text-shadow'>Exchange</span>
      </div>
      <div className='circle no-select flex flex-col flex-v-center flex-h-center'>
        <Link to='/recommendation' className='flex flex-v-center flex-h-center'>
          <span className='material-symbols-outlined'>thumb_up</span>
        </Link>
        <span className='text-shadow'>For you</span>
      </div>
      <div className='circle no-select flex flex-col flex-v-center flex-h-center'>
        <button type='button' onClick={handleLogout} className='flex flex-v-center flex-h-center'>
          <span className='material-symbols-outlined'>logout</span>
        </button>
        <span className='text-shadow'>Logout</span>
      </div>
    </div>
  );
};

export default Actions;