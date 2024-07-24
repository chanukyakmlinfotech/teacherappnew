const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log('A user connected');

  // Example function to add a new student
  const addStudent = (student) => {
    io.emit('addstudent', student);
  };

  // Dummy student data to emit after a certain action (e.g., button click)
  const newStudent = {
    id: '1234',
    username: 'New Student',
    deviceType: 'Windows',
    isOnline: true
  };

  // Simulate adding a new student after 5 seconds
  setTimeout(() => {
    addStudent(newStudent);
  }, 5000);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
