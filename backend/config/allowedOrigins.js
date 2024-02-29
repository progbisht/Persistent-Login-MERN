// for limiting the ips that can access our backend server 
// Here we have to put our ip of our react server for connection with the backend server 

const allowedOrigins = [
    'https://www.google.co.in/', 
    'http://localhost:3500',
    'http://localhost:3000'
];

module.exports = allowedOrigins