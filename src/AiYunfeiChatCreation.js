import React, { useState } from 'react';
import './AiYunfeiChatCreation.css';
import startIcon from './Aistart.png';  // Ensure you have the start.png image in the appropriate path
import AiheaderIcon from './AiHeader.png'; // Update the import to match the actual file name
import playIcon from './Aiplay.png';     // Ensure you have the play.png image in the appropriate path
import AicloseIcon from './Aiclose.png';

const AiYunfeiChatCreation = ({ isOpen, setIsOpen, students, yunfieList, sendProtocolToApp, questionId, token }) => {
  const [subject, setSubject] = useState('');
  const [schoolYear, setSchoolYear] = useState('');
  const [duration, setDuration] = useState('');
  const [learningObjective, setLearningObjective] = useState('');
  const [responseType, setResponseType] = useState('Text');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartClick = () => {
    const value = parseInt(duration) * 60;
    const clients = students.filter(student => student.isOnline && student.isSelected).map(student => student.profile.id);

    const parameters = {
      subject,
      school_year: parseInt(schoolYear),
      time: value,
      objective: learningObjective,
      question_id: questionId,
      response_type: responseType,
      token,
      clients
    };

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      sendProtocolToApp(parameters);
      setIsOpen(false);
    }, 2000);
  };

  const getSubjects = () => {
    // Your getSubjects logic here
  };

  return (
    <div className="overlay">
      <div className="ai-yunfei-chat-creation">
        <div className="Aiheader">
          <img src={AiheaderIcon} alt="AiHeader" className="Aiheader-icon" />
          <span className="chat-title">AI YunFei</span>
          <button className="AicloseIcon" onClick={() => setIsOpen(false)}>&times;</button>
        </div>
        <div className="form">
          <div className="dropdowns">
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Subject</option>
              <option value="English">English</option>
              <option value="Chinese">Chinese</option>
              <option value="Math">Math</option>
              <option value="Geography">geography</option>
              <option value="History">history</option>
              <option value="Citizen">citizen</option>
              <option value="Biology">biology</option>
              <option value="Earth Science">Earth Science</option>
              <option value="Living Technology">Living Technology</option>
              <option value="Music">music</option>
              <option value="Information">information</option>
              {/* Add more options here */}
            </select>
            <select value={schoolYear} onChange={(e) => setSchoolYear(e.target.value)}>
              <option value="">School Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="">Duration</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
            <select value={learningObjective} onChange={(e) => setLearningObjective(e.target.value)}>
              <option value="">Learning Objective</option>
              <option value="Listening">Listening</option>
              <option value="Speaking">Speaking</option>
              <option value="Reading">Reading</option>
              <option value="Writing">Writing</option>
              <option value="Grammar">Grammar</option>
            </select>
          </div>
          <div className="response-type">
            <label className="response-type-label">Response type</label>
          </div>
          <div className="radio-buttons">
            <label>
              <input
                type="radio"
                value="Text"
                checked={responseType === 'Text'}
                onChange={() => setResponseType('Text')}
              />
              Text
            </label>
            <label>
              <input
                type="radio"
                value="Audio"
                checked={responseType === 'Audio'}
                onChange={() => setResponseType('Audio')}
              />
              Audio
            </label>
          </div>
          <div className="start-button-container">
            <button className="start-button" onClick={handleStartClick}>
              <img src={startIcon} alt="Start" className="start-icon" />
              <img src={playIcon} alt="Play" className="play-icon" />
            </button>
          </div>
        </div>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiYunfeiChatCreation;