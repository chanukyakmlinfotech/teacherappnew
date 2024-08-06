import React from 'react';
import './GroupingHeaderView.css';
import closeIcon from './GRclose.png';
import groupingImage from './Grouping.png'; // Make sure you have the correct path for the image

const GroupingHeaderView = ({ onClear, onClose }) => {
  return (
    <div className="grouping-header">
      <img src={groupingImage} alt="grouping" className="grouping-image" />
      <h2 className="grouping-title">Grouping</h2>
      <div className="header-buttons">
        <button className="clear-button" onClick={onClear}>Clear</button>
        <button className="close-button" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default GroupingHeaderView;


