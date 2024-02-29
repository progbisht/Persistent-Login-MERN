import { useState, useEffect, useRef } from 'react';
import { faCheck, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import axios from '../api/axios';


const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/
const PASSWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$%!@#%^&*]).{8,24}$/
const REGISTER_URL = '/register';


const Register = () => {
    const userRef = useRef();
    const errRef = useRef();


    const [user, setUser] = useState('');
    const [validUser, setValidUser] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [passwd, setPasswd] = useState('');
    const [validPasswd, setValidPasswd] = useState(false);
    const [passwdFocus, setPasswdFocus] = useState(false);
    
    const [matchPasswd, setMatchPasswd] = useState('');
    const [validMatchPasswd, setValidMatchPasswd] = useState(false);
    const [matchPasswdFocus, setMatchPasswdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(()=>{
        userRef.current.focus();
    }, []);

    useEffect(()=>{
        setValidUser(USER_REGEX.test(user));
    }, [user]);

    useEffect(()=>{
        setValidPasswd(PASSWD_REGEX.test(passwd));
        setValidMatchPasswd(passwd === matchPasswd);
    }, [passwd, matchPasswd]);

    useEffect(()=>{
        setErrMsg('');
    }, [user, passwd, matchPasswd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usr = USER_REGEX.test(user);
        const pwd = PASSWD_REGEX.test(passwd);

        if(!usr || !pwd){
            setErrMsg("Invalid Entry");
            return;
        }
        
        try{
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({
                    uname : user,
                    passwd : passwd
                }),
                {
                    headers : {"Content-Type" : 'application/json'},
                    withCredentials : true
                }
            );

            console.log(response.data);
            setSuccess(true);
        }
        catch(err){
            if(!err?.response){
                setErrMsg('No Response from server');
            }
            else if(err?.response?.status === 409){
                setErrMsg('Username already taken');
            }
            else{
                setErrMsg('Registeration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
        {
            success ? (
                <section>
                    <h1>Registered Successfully! </h1>
                    <span className='line'>
                        <Link to='/login'>Sign In</Link>
                    </span>
                </section>
            ) : (
            
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='username'> 
                            Username: 
                            <FontAwesomeIcon icon={faCheck} className={validUser ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validUser || !user ? "hide" : "invalid"} />
                        </label>
                        <input
                            ref={userRef}
                            id='username'
                            type='text'
                            autoComplete='off'
                            required
                            onChange={(e)=>setUser(e.target.value)}
                            value={user}
                            aria-invalid={validUser ? "false" : "true"}
                            aria-describedby='uidnote'
                            onFocus={()=>setUserFocus(true)}
                            onBlur={()=>setUserFocus(false)}
                        />
                        <p id='uidnote' className={userFocus && user && !validUser ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 character.<br/>
                            Must begin with letter<br/>
                            Can contain letter, digits, underscore and hyphen
                        </p>
                        <label htmlFor='password'> 
                            Password: 
                            <FontAwesomeIcon icon={faCheck} className={validPasswd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPasswd || !passwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            ref={userRef}
                            id='password'
                            type='password'
                            autoFocus
                            required
                            onChange={(e)=>setPasswd(e.target.value)}
                            value={passwd}
                            aria-invalid={validPasswd ? "false" : "true"}
                            aria-describedby='passwdnote'
                            onFocus={()=>setPasswdFocus(true)}
                            onBlur={()=>setPasswdFocus(false)}
                        />
                        <p id='passwdnote' className={passwdFocus && passwd && !validPasswd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 character.<br/>
                            Must contain a capital letter, a small letter and a digit<br/>
                            Must contain a special character like $,#,@<br/>
                            Can contain letter, digits, and special character
                        </p>
                        <label htmlFor='cpassword'> 
                            Confirm Password: 
                            <FontAwesomeIcon icon={faCheck} className={validMatchPasswd && matchPasswd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatchPasswd || !matchPasswd ? "hide" : "invalid"} />
                        </label>
                        <input
                            ref={userRef}
                            id='cpassword'
                            type='password'
                            autoFocus
                            required
                            onChange={(e)=>setMatchPasswd(e.target.value)}
                            value={matchPasswd}
                            aria-invalid={validMatchPasswd ? "false" : "true"}
                            aria-describedby='matchnote'
                            onFocus={()=>setMatchPasswdFocus(true)}
                            onBlur={()=>setMatchPasswdFocus(false)}
                        />
                        <p id='matchnote' className={matchPasswdFocus && matchPasswd && !validPasswd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the password input field.
                        </p>
                    
                        <button disabled={!validUser || !validPasswd || !validMatchPasswd ? true : false}>Sign Up</button>
                        <p className='bottom'>
                            Already Registered <br/>
                            <span className='line'>
                                <Link to='/login'>Sign In</Link>
                            </span>
                        </p>
                    </form>
                </section>
            )
        }
        </>
    );
}

export default Register


