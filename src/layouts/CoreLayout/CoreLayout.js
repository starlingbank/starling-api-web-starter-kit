import React from 'react';
import PropTypes from 'prop-types';
import Header from '../../components/Header';

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
  children: PropTypes.element.isRequired
};

export default CoreLayout;
