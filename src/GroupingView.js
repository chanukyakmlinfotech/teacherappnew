// GroupingView.js

import React, { useState, useEffect } from 'react';
import GroupingDropDownPicker from './GroupingDropDownPicker';
import GroupingHeaderView from './GroupingHeaderView';
import GroupingSearchView from './GroupingSearchView';
import GroupingStudentsManualView from './GroupingStudentsManualView';
import GroupingStudentsAutomaticView from './GroupingStudentsAutomaticView';
import './GroupingView.css';

const GroupingView = ({ students, setIsGroupingViewOpen, setStudents }) => {
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isAutomaticGrouping, setIsAutomaticGrouping] = useState(true);
  const [groupOptions, setGroupOptions] = useState(['Group1', 'Group2', 'Group3', 'Group4', 'Group5']);
  const [selectedGroupOption, setSelectedGroupOption] = useState('Divide into two groups');
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(1);

  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);

  const handleGroupChange = (studentId, group) => {
    setFilteredStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, group: group } : student
      )
    );
  };

  const handleManualGroupChange = (studentId) => {
    setFilteredStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId ? { ...student, group: selectedGroupIndex } : student
      )
    );
  };

  const handleClear = () => {
    setFilteredStudents((prevStudents) =>
      prevStudents.map((student) => ({ ...student, group: null }))
    );
  };

  const handleClose = () => {
    setIsGroupingViewOpen(false);
  };

  const getGroupCount = () => {
    switch (selectedGroupOption) {
      case 'Divide into two groups':
        return 2;
      case 'Divide into three groups':
        return 3;
      case 'Divide into four groups':
        return 4;
      case 'Divide into five groups':
        return 5;
      default:
        return 5;
    }
  };

  const handleComplete = () => {
    setStudents((prevStudents) => {
      const updatedStudents = prevStudents.map(student => {
        const filteredStudent = filteredStudents.find(fs => fs.id === student.id);
        return filteredStudent ? { ...student, group: filteredStudent.group } : student;
      });
      return updatedStudents;
    });
    alert('Grouping complete and saved!');
    handleClose();
  };

  return (
    <div className="grouping-view">
      <GroupingHeaderView onClear={handleClear} onClose={handleClose} />
      <div className="grouping-options">
        <button
          className={`grouping-mode-button ${isAutomaticGrouping ? 'active' : ''}`}
          onClick={() => setIsAutomaticGrouping(true)}
        >
          Auto Grouping
        </button>
        <button
          className={`grouping-mode-button ${!isAutomaticGrouping ? 'active' : ''}`}
          onClick={() => setIsAutomaticGrouping(false)}
        >
          Manual Grouping
        </button>
        <GroupingDropDownPicker
          options={['Divide into two groups', 'Divide into three groups', 'Divide into four groups', 'Divide into five groups']}
          selectedOption={selectedGroupOption}
          setSelectedOption={setSelectedGroupOption}
        />
      </div>
      <div className="grouping-search-group-buttons">
        {!isAutomaticGrouping && (
          <div className="group-buttons">
            {groupOptions.slice(0, getGroupCount()).map((group, index) => (
              <button
                key={index}
                className={`group-button ${selectedGroupIndex === index + 1 ? 'selected' : ''}`}
                onClick={() => setSelectedGroupIndex(index + 1)}
              >
                <input
                  type="radio"
                  name="group-selection"
                  checked={selectedGroupIndex === index + 1}
                  readOnly
                  className={`radio-custom radio-color-${index + 1}`}
                />
                {group}
              </button>
            ))}
          </div>
        )}
        <GroupingSearchView students={students} setFilteredStudents={setFilteredStudents} />
      </div>
      {isAutomaticGrouping ? (
        <GroupingStudentsAutomaticView
          students={filteredStudents}
          onGroupChange={handleGroupChange}
          groupOptions={groupOptions.slice(0, getGroupCount())}
        />
      ) : (
        <div className="manual-grouping">
          <GroupingStudentsManualView
            students={filteredStudents}
            onGroupChange={handleManualGroupChange}
            selectedGroupIndex={selectedGroupIndex}
          />
        </div>
      )}
      <div className="complete-button-container">
        <button className="complete-button" onClick={handleComplete}>Complete</button>
      </div>
    </div>
  );
};

export default GroupingView;
