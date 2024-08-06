import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './Header';
import StudentCard from './StudentCard';
import StudentMagnifierView from './StudentMagnifierView';
import ScreenShareView from './ScreenShareView';
import socketIOClient from 'socket.io-client';
import GroupingView from './GroupingView';
import groupingbutton from './groupbutton.png'; // Update the path
import AiYunfeiChatCreation from './AiYunfeiChatCreation'; // Ensure this path is correct
import yunfieChatButton from './Ai-yunifiechat.png'; // Ensure this path is correct
import YunfeiChatHistory from './YunfeiChatHistory'; // Ensure this path is correct
import yunfieChathistoryButton from './AI-Yunfiehistory.png';
import SignalingClient from './SignalingClient'; // Ensure this path is correct

function App() {
  const [students, setStudents] = useState([]);
  const [isOpenStudentMagnifierPopup, setIsOpenStudentMagnifierPopup] = useState(false);
  const [magniferStudent, setMagniferStudent] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [blockList, setBlockList] = useState([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenShareUrl, setScreenShareUrl] = useState('');
  const [isGroupBroadcastStarted, setIsGroupBroadcastStarted] = useState(true); // Assuming the default value is true
  const socketRef = useRef(null);
  const [isGroupingViewOpen, setIsGroupingViewOpen] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isAiYunfeichatOpen, setIsAiYunfeichatOpen] = useState(false);
  const [isYunfeiChatHistoryOpen, setIsYunfeiChatHistoryOpen] = useState(false);
  const [isOpenBrowsingHistoryPopup, setIsOpenBrowsingHistoryPopup] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // Add state for chat history
  const questionId = 'some-question-id';
  const token = 'some-token';
  

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = socketIOClient("https://socket.gto.to");

      socketRef.current.on('connect', () => {
        console.log("Connected to server");
        handlePinLogin();
      });

      socketRef.current.on('disconnect', () => {
        console.log("Disconnected from server");
      });

      socketRef.current.on('addStudent', (newStudent) => {
        try {
          console.log("New student added:", newStudent);
          if (!newStudent.deviceType) {
            console.warn('New student is missing deviceType:', newStudent);
          }
          setStudents(prevStudents => [
            ...prevStudents,
            { ...newStudent, isOnline: false, isLocked: false, screenshot: '', activeTab: '', group: '' }
          ]);

          let list = students.map(student => student.userId);
          list.push(newStudent.userId);

          socketRef.current.emit('subscribeToStudents', { clients: list });

          list.forEach(id => {
            socketRef.current.emit('sendCommand', {
              id: id,
              teacher: "t21@dev.gafeslam.com",
              command: "iamwatching"
            });
          });

        } catch (e) {
          console.error("Error adding new student:", e);
        }
      });

      socketRef.current.on('studentOnline', (data) => {
        console.log("Student online:", data.id);
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.userId === data.id ? { ...student, isOnline: true } : student
          )
        );
      });

      socketRef.current.on('studentScreenshot', (data) => {
        console.log("Student screenshot:", data.id);
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.userId === data.id ? { ...student, screenshot: data.image, isOnline: true } : student
          )
        );
      });
    }
  }, [students]);

  const handlePinLogin = () => {
    socketRef.current.emit('teacherOnline', {
      clients: [],
      class: "Demo",
      name: "t21@dev.gafeslam.com",
      id: "t21@dev.gafeslam.com",
      device_type: "Windows",
      version: "9.10.33",
      pin: "255403"
    });
    console.log("Emitting pin login event");
  };

  const handleLock = (username) => {
    console.log(`Locking ${username}`);
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.profile.name.fullName === username ? { ...student, isLocked: true } : student
      )
    );

    const student = students.find(student => student.profile.name.fullName === username);
    if (student) {
      socketRef.current.emit('sendCommand', {
        id: student.userId,
        teacher: "t21@dev.gafeslam.com",
        command: "lock"
      });
    }
  };

  const handleUnlock = (username) => {
    console.log(`Unlocking ${username}`);
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.profile.name.fullName === username ? { ...student, isLocked: false } : student
      )
    );

    const student = students.find(student => student.profile.name.fullName === username);
    if (student) {
      socketRef.current.emit('sendCommand', {
        id: student.userId,
        teacher: "t21@dev.gafeslam.com",
        command: "unlock"
      });
    }
  };

  const onlineCount = students.filter(student => student.isOnline).length;
  const offlineCount = students.filter(student => !student.isOnline).length;

  const handleOpenMagnifier = (student) => {
    setMagniferStudent(student);
    setIsOpenStudentMagnifierPopup(true);
  };

  const handleStartScreenSharing = (url) => {
    setScreenShareUrl(url);
    setIsScreenSharing(true);
  };
  
  const handleGroupingButtonClick = () => {
    const onlineStudents = students.filter(student => student.isOnline);
    setFilteredStudents(onlineStudents);
    setIsGroupingViewOpen(true);
  };

  const handleOpenAiYunfeichat = () => {
    setIsAiYunfeichatOpen(true);
  };

  const handleOpenBrowsingHistory = () => {
    setIsOpenBrowsingHistoryPopup(true);
  };

  const handleProtocol = (protocolData) => {
    socketRef.current.emit('startAiAssistant', protocolData);
  };

  
  return (
    <div className="App">
      {isScreenSharing ? (
        <ScreenShareView
          students={students}
          screenShareStarted={true}
          setScreenShareStarted={setIsScreenSharing}
          isGroupBroadcastStarted={isGroupBroadcastStarted} // Pass the actual value here
          url={screenShareUrl}
        />
      ) : (
        <>
          <Header onlineCount={onlineCount} offlineCount={offlineCount} />
          <button onClick={handleGroupingButtonClick} className="grouping-button">
            <img src={groupingbutton} alt="Group" />
          </button>
          <button className="yunfeichatbutton" onClick={handleOpenAiYunfeichat}>
            <img src={yunfieChatButton} alt="Yunfei Chat" />
          </button>
          <button className="browsing-history-button" onClick={handleOpenBrowsingHistory}>
            <img src={yunfieChathistoryButton} alt="Browsing History" />
          </button>
          <div className="student-cards-container">
            {students.map((student, index) => (
              <StudentCard
                key={index}
                username={student.profile.name.fullName}
                deviceType={student.deviceType}
                isOnline={student.isOnline}
                isLocked={student.isLocked}
                handleLock={handleLock}
                handleUnlock={handleUnlock}
                handleOpenMagnifier={() => handleOpenMagnifier(student)}
                handleStartScreenSharing={() => handleStartScreenSharing(student.userId)} // Replace with actual URL
                screenshot={student.screenshot} // Pass screenshot URL to StudentCard
                group={student.group} // Pass the group information
              />
            ))}
          </div>
          {isOpenStudentMagnifierPopup && (
            <StudentMagnifierView
              isOpenStudentMagnifierPopup={isOpenStudentMagnifierPopup}
              setIsOpenStudentMagnifierPopup={setIsOpenStudentMagnifierPopup}
              magniferStudent={magniferStudent}
              refresh={refresh}
              setRefresh={setRefresh}
              blockList={blockList}
              setBlockList={setBlockList}
            />
          )}

          {isGroupingViewOpen && (
            <GroupingView
              students={filteredStudents}
              setIsGroupingViewOpen={setIsGroupingViewOpen}
              setStudents={setStudents} // Pass the setStudents function to update the main student list
            />
          )}
          {isAiYunfeichatOpen && (
            <AiYunfeiChatCreation
              isOpen={isAiYunfeichatOpen}
              setIsOpen={setIsAiYunfeichatOpen}
              students={students}
              yunfieList={[]}
              sendProtocolToApp={handleProtocol} // Pass the protocol handler
              questionId={questionId}
              token={token}
            />
          )}
          {isOpenBrowsingHistoryPopup && (
            <YunfeiChatHistory
              setIsOpen={setIsOpenBrowsingHistoryPopup}
              chatHistory={chatHistory} // Pass chat history to the component
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
