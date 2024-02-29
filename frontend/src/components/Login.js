import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';

const LOGIN_URL = '/auth'

const Login = () => {

    const { setAuth, persist, setPersist } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/'

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [passwd, setPasswd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    

    useEffect(()=>{
        userRef.current.focus();
    }, []);

    useEffect(()=>{
        setErrMsg('');
    }, [user, passwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(user,passwd);

        try{
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({
                    uname : user,
                    passwd : passwd
                }),
                {
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    withCredentials : true
                }    
            );
            console.log(response?.data);
            // console.log(response);
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;

            setAuth({user, passwd, roles, accessToken});
            setUser('');
            setPasswd('');
            navigate(from, {replace:true});
        }
        catch(err){
            if(!err?.response){
                setErrMsg('No server response');
            }
            else if(err.response?.status === 400){
                setErrMsg('Missing username and password');
            }
            else if(err.response?.status === 401){
                setErrMsg('Unauthorized');
            }
            else {
                setErrMsg('Login Failed');
            }

            errRef.current.focus();
        }

    }

    const togglePersist = () => {
        setPersist(prev => !prev)
    }

    useEffect(() => {
        localStorage.setItem("persist", persist)
    }, [persist ])

    return (
        
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                {errMsg}
            </p>
            <h1>Sign In</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor='username'>Username:</label>
                <input
                    type='text'
                    id='username'
                    ref={userRef}
                    required
                    autoComplete='off'
                    onChange={(e)=> setUser(e.target.value)}
                    value={user}
                />
                <label htmlFor='password'>Password:</label>
                <input
                    type='password'
                    id='password'
                    required
                    onChange={(e)=>setPasswd(e.target.value)}
                    value={passwd}               
                />
                <button>Sign In</button>
                <div className='persistCheck'>
                    <input 
                        type='checkbox'
                        id='persist'
                        onChange={togglePersist}
                        checked={persist}
                    />
                    <label htmlFor='persist'>Trust this device</label>
                </div>
            </form>
            <p>
                Create Account<br/>
                <span className="line">
                    <Link to='/register'>Sign Up</Link>
                </span>

            </p>
        </section>
               
    )
}

export default Login