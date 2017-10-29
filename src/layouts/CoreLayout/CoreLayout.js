import React from 'react';
import Header from '../../components/Header';
import '../../styles/core.scss';
import { element } from 'prop-types';

export const CoreLayout = ({ children }) => 
  <div className='fw fh'>
    <div className='headerMargin'>
      <Header />
    </div>
    <div className='fw fh'>
      {children}
      <br />
    </div>
  </div>;


CoreLayout.propTypes = {
  children: element.isRequired
};

export default CoreLayout;
