import React, { useState, useEffect } from 'react';
import './GroupingSearchView.css';
import searchIcon from './search.png'; // Make sure to have the correct path for the image

const GroupingSearchView = ({ students, setFilteredStudents }) => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter(student =>
          student.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [searchText, students, setFilteredStudents]);

  return (
    <div className="grouping-search">
      <div className="search-input-container">
        <img src={searchIcon} alt="Search" className="search-icon" />
        <input
          type="text"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default GroupingSearchView;
