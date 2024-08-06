import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import './StudentMagnifierView.css';
import socketIOClient from 'socket.io-client';

// Ensure the modal is set up to bind to your app element
Modal.setAppElement('#root');

const StudentMagnifierView = ({
  isOpenStudentMagnifierPopup,
  setIsOpenStudentMagnifierPopup,
  magniferStudent,
  refresh,
  setRefresh,
  blockList,
  setBlockList,
}) => {
  const [studentScreenshotUrl, setStudentScreenshotUrl] = useState('');
  const [activeTabUrl, setActiveTabUrl] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = socketIOClient("https://socket.gto.to");
    }

    if (magniferStudent) {
      // Fetch Active Tab URL using SignalingClient
      socketRef.current.emit('getActiveTabUrl', { id: magniferStudent.userID }, (data) => {
        console.log('Fetched Active Tab URL:', data.activeTab);
        if (data.activeTab) {
          setActiveTabUrl(data.activeTab);
        } else {
          console.error('Active Tab URL is empty or undefined');
        }
      });

      // Setting Screenshot
      setStudentScreenshotUrl(magniferStudent.screenshot);
    }

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [magniferStudent, refresh]);

  const closeModal = () => {
    setIsOpenStudentMagnifierPopup(false);
  };

  const blockStudent = async () => {
    try {
      console.log('Attempting to block URL:', activeTabUrl);
      if (!activeTabUrl || !isValidUrl(activeTabUrl)) {
        console.error('Invalid URL detected:', activeTabUrl);
        throw new Error('Invalid URL');
      }
      const url = new URL(activeTabUrl);
      const domain = url.host;
      const newBlockList = [...blockList, { url: `*://${domain}/*`, lock: true }];

      setBlockList(newBlockList);

      const list = newBlockList.filter(block => block.lock).map(block => block.url);

      await socketRef.current.emit('dynamicBlockSites', { id: magniferStudent.userID, blocks: list });
      await socketRef.current.emit('closeTheTab', { id: magniferStudent.userID, tab: activeTabUrl });

      setRefresh(prev => prev + 1); // Trigger a re-render if necessary
    } catch (error) {
      console.error('Failed to block student:', error);
    }
  };

  const closeStudentUrl = async () => {
    try {
      console.log('Attempting to close URL:', activeTabUrl);
      if (!activeTabUrl || !isValidUrl(activeTabUrl)) {
        console.error('Invalid URL detected:', activeTabUrl);
        throw new Error('Invalid URL');
      }
      await socketRef.current.emit('closeTheTab', { id: magniferStudent.userID, tab: activeTabUrl });

      setRefresh(prev => prev + 1);
    } catch (error) {
      console.error('Failed to close URL:', error);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (error) {
      console.error('URL validation error:', error, 'URL:', string);
      return false;
    }
  };

  return (
    <Modal
      isOpen={isOpenStudentMagnifierPopup}
      onRequestClose={closeModal}
      contentLabel="Student Magnifier"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="magnifier-container">
        {magniferStudent && (
          <img
            className="avatar"
            src={require('./images/avatar1.png')}
            alt="Avatar"
          />
        )}
        <h2 className="name">{magniferStudent?.profile?.name?.fullName}</h2>

        <div className="innerContainer">
          {studentScreenshotUrl && (
            <a href={studentScreenshotUrl} target="_blank" rel="noopener noreferrer">
              <img src={studentScreenshotUrl} alt="Student Screenshot" className="screenshot" />
            </a>
          )}
        </div>

        {activeTabUrl && (
          <div className="active-tab-container">
            <strong>Active Tab: </strong>
            <a href={activeTabUrl} target="_blank" rel="noopener noreferrer">
              {activeTabUrl}
            </a>
          </div>
        )}

        <button className="icon-button close-button-top-right" onClick={closeModal}>
          <img src={require('./images/closebutton.png')} alt="Close" />
        </button>
        
        <div className="button-container">
          <button className="icon-button block-button" onClick={blockStudent}>
            <img src={require('./images/block.png')} alt="Block" />
          </button>
          <button className="icon-button close-button" onClick={closeStudentUrl}>
            <img src={require('./images/close.png')} alt="Close URL" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StudentMagnifierView;
