import React from 'react';
import PropTypes from 'prop-types';

import './styles.styl';

export const LoaderComponent = ({ message }) => {
  return (
    <div className="loading">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="gooey">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feBlend
              in="SourceGraphic"
              in2="goo"
            />
          </filter>
        </defs>
      </svg>
      <div className="blob blob-0" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      <div className="blob blob-5" />
      <div className="blob-message">
        {message}
      </div>
    </div>
  );
};

LoaderComponent.propTypes = {
  message: PropTypes.string,
};

export default LoaderComponent;
