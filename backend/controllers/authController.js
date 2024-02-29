// const userDB = {
//     users : require('../models/users.json'),
//     setUser : function(data) { this.users = data }
// }

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const fsPromises = require('fs').promises;
// const path = require('path');
const User = require('../models/User');

// method for user authentication that the user with the credentials is authorized user
const authUser = async (req,res) => {
    const {uname, passwd} = req.body;

    if(!uname || !passwd){
        return res.status(400).json({
            "message" : "Username and Password are required. "
        });
    }
    
    // const existingUser = userDB.users.find(user => user.username === uname);
    const existingUser = await User.findOne( { username : uname } )


    if(!existingUser){
        return res.status(401).json({
            "message" : "Unauthorized User"
        });
    }
    
    const foundUser = await bcrypt.compare(passwd,existingUser.password);

    if(foundUser){

        const roles = Object.values(existingUser.roles).filter(Boolean);
        console.log(roles);

        // generating access token and refresh token for user to authenticate
        const accessToken = jwt.sign(
            {
                "UserInfo" : {
                    "username" : existingUser.username,
                    "roles" : roles
                }         
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn : "10s" }
        );

        const refreshToken = jwt.sign(
            { "username" : existingUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn : "15s" }
        );


        // storing the refresh token in memory
        // const otherUsers = userDB.users.filter(user => user.username !== existingUser.username);
        // const currentUser = {...existingUser, refreshToken};
        // userDB.setUser([...otherUsers,currentUser]);

        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'models', 'users.json'),
        //     JSON.stringify(userDB.users)
        // )

        
        existingUser.refreshToken = refreshToken;
        const result = await existingUser.save();
        console.log(result);
        
        // setting cookie value with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly : true,
            sameSite: 'None',
            secure: true,
            maxAge : 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            roles,
            accessToken
        });
    }
    else{
        res.status(401).json({
            "message" : "Unauthorized User"
        });
    }
}

module.exports = {
    authUser
}