// const userDB = {
//     users : require('../models/users.json'),
//     setUsers : function(data){ this.users = data}
// }

// const fsPromises = require('fs').promises;
// const path = require('path');


const User = require('../models/User');
const bcrypt = require('bcryptjs');


const newUserRegistration = async (req,res) => {
    const {uname , passwd} = req.body;
    
    if(!uname || !passwd){
        return res.status(400).json({
            "message" : "Username and password are required"
        });
    }

    // const duplicate = userDB.users.find(user => user.username === uname);
   
    const duplicate = await User.findOne( { username : uname } ).exec();
    // console.log(duplicate);

    if(duplicate){
        return res.status(409).json({
            "message" : "User with username already exists"
        });
    }

    try{
        const hashedPasswd = await bcrypt.hash(passwd, 10);

        // const newUser = {
        //     "username" : uname,
        //     "roles" : {
        //         "User" : 2000
        //     },
        //     "password" : hashedPasswd
        // }
        
        // userDB.setUsers([...userDB.users, newUser]);

        // await fsPromises.writeFile(path.join(__dirname,'..','models','users.json'), JSON.stringify(userDB.users));

        const result = await User.create({
            "username" : uname,
            "password" : hashedPasswd
        });

        console.log(result);

        res.status(201).json(`New user ${uname} created.`);
 
    }
    catch(err){
        res.status(500).json({
            "message" : err.message
        })
    }

}

module.exports = {
    newUserRegistration
}