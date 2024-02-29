import axios from 'axios';
const BASE_URL = 'http://localhost:3500';


export default axios.create({
    baseURL : BASE_URL
});


// for attaching the interceptors with axios private (attach jwt token and even retry the request 403 if failed initially)
// interceptors are going to work with jwt and ref resh the token if our initial request is denied
export const axiosPrivate = axios.create({
    baseURL : BASE_URL,
    headers : { 'Content-Type' : 'application/json' },
    withCredentials : true
});