import React from 'react';
import './GroupingStudentsAutomaticView.css';

const GroupingStudentsAutomaticView = ({ students, onGroupChange, groupOptions }) => {
  return (
    <div className="students-view">
      {students.map((student) => (
        <div key={student.id} className="student-item">
          <div className="dot-button">
            <span className={`dot-button ${student.isOnline ? "online" : "offline"}`}></span>
          </div>
          <div className="student-info">
            <span>{student.profile.name.fullName}</span> {/* Display student name */}
            <span className={`status ${student.isOnline ? "online" : "offline"}`}></span>
          </div>
          <select
            className="group-select"
            value={student.group || ''}
            onChange={(e) => onGroupChange(student.id, e.target.value)}
            disabled={!student.isOnline} /* Disable select if student is offline */
          >
            <option value="" disabled>Select Group</option>
            {groupOptions.map((group, index) => (
              <option key={index} value={index + 1}>
                {group}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default GroupingStudentsAutomaticView;
