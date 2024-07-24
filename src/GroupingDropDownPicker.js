import React from 'react';

const GroupingDropDownPicker = ({ options, selectedOption, setSelectedOption }) => {
  return (
    <div className="dropdown">
      <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className="dropdown-header"
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GroupingDropDownPicker;


