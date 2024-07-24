import React from 'react';
import './GroupingStudentsManualView.css';

const GroupingStudentsManualView = ({ students, onGroupChange, selectedGroupIndex }) => {
  return (
    <div className="students-view">
      {students.map((student) => (
        <div key={student.id} className="student-item">
          <input
            type="radio"
            name={`group-${student.id}`}
            checked={student.group === selectedGroupIndex}
            onChange={() => onGroupChange(student.id, selectedGroupIndex)}
            disabled={!student.isOnline} /* Disable radio if student is offline */
            className="group-radio"
          />
          <div className="student-info">
            <span>{student.profile.name.fullName}</span> {/* Display student name */}
            <span className={`status ${student.isOnline ? "online" : "offline"}`}></span>
            <span>{student.isOnline ? "" : ""}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupingStudentsManualView;
