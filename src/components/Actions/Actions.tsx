import React from 'react';

import { Link } from 'react-router-dom';

const Actions = (): React.JSX.Element => (
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
        <span className='material-symbols-outlined'>page_info</span>
      </Link>
      <span className='text-shadow'>Reco</span>
    </div>
    {/* <div className='circle no-select flex flex-col flex-v-center flex-h-center'>
      <button type='button' className='flex flex-v-center flex-h-center'>
        <span className='material-symbols-outlined'>more_horiz</span>
      </button>
      <span className='text-shadow'>For you</span>
    </div> */}
  </div>
);

export default Actions;
