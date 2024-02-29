import { useState, useEffect, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';


const Users = () => {
    const [ users, setUsers ] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();

    const effectRun = useRef(false);


    useEffect(() => {

        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try{
                const response = await axiosPrivate.get('/users', {
                    signal : controller.signal
                });
                
                console.log("Userdata", response.data);
                isMounted && setUsers(response.data);
            }
            catch(err){
                console.log("Error" ,err);
                // in case refresh token expires user needs to login and revert back to their location before logging in
                navigate('/login', { state: { from:location }, replace:true });
            }
        }

        // Check if useEffect has run the first time
        if (effectRun.current) {
            getUsers();
        }

        return () => {
            isMounted = false;
            controller.abort();
            effectRun.current = true; // update the value of effectRun to true
        }

    }, [axiosPrivate]);

    return (
        <article>
            <h2>Users List</h2>
            {users.length ?
                (
                    <ul>
                        {users.map((user,i) => <li key={i}>{user.username}</li>)}
                    </ul>
                ):
                <p> No users to display. </p>
            }
            
        </article>
    )
}

export default Users