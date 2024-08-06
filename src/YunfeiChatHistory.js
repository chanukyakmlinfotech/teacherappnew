import React, { useState } from 'react';
import './YunfeiChatHistory.css';
import AiheaderIcon from './AiheaderIcon.png'; // Replace with your actual path
import closeIcons from './Aiclos.png'; // Replace with your actual path

const YunfeiChatHistory = ({ setIsOpen, chatHistory }) => {
  const [selectedStudent, setSelectedStudent] = useState('21');
  const [selectedDuration, setSelectedDuration] = useState('Duration');

  return (
    <div className="chat-history-container">
      <div className="chatheader">
        <img src={AiheaderIcon} alt="Header Icon" className="header-icon" />
        <span className="chathistory-title">Yunfei Chat history</span>
        <button className="Aiclose-button" onClick={() => setIsOpen(false)}>
          <img src={closeIcons} alt="Close" className="close-ico" />
        </button>
      </div>
      <div className="filter-bar">
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="Aidropdown"
        >
          <option value="21">21</option>
          {/* Add more options as needed */}
        </select>
        <select
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(e.target.value)}
          className="Aidropdown"
        >
          <option value="Duration">Duration</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <div className="chat-content">
        {chatHistory.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender === 'teacher' ? 'teacher' : 'student'}`}>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YunfeiChatHistory;
