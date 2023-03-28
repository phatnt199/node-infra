import { io } from 'socket.io-client';

const client = io('http://0.0.0.0:1199', { 
  path: '/v1/api'
})

client.on('error', (error) => {
  console.log(error);
})

client.on('connect', () => {
  console.log('Connected');
});

client.on('ping', () => {
  console.log('PING');
});

console.log('establish');
