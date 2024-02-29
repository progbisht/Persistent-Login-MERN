// const userDB = {
//     users : require('../models/users.json'),
//     setUser : function(data) { this.users = data }
// }

// const fsPromises = require('fs').promises;
// const path = require('path');

const User = require('../models/User');

// method for clearing the cookie and deleting the refresh token once user logs out
const handleLogout = async (req,res) => {
    const authCookies = req.cookies;

    // checking for the jwt property in cookies
    if(!authCookies?.jwt) return res.sendStatus(204);   // No content

    // accessing and checking the refresh token belongs to valid user
    const refreshToken = authCookies.jwt;

    // const foundUser = userDB.users.find(user => user.refreshToken === refreshToken);
    const foundUser = await User.findOne({ refreshToken }).exec();

    // if cookie does not belongs to a valid user then cleaning the cookie
    if(!foundUser) {
        res.clearCookie('jwt', refreshToken, {
            httpOnly : true,
            sameSite: 'None',
            secure: true,
            maxAge : 24 * 60 * 60 * 1000
        });
        return res.sendStatus(204);     // No content
    }

    // else if user is valid and logging out then deleting the refresh token and clearing the cookie.
    // const otherUsers = userDB.users.filter(user => user.username !== foundUser.username);
    // const currentUser = {...foundUser, refreshToken:''}
    // userDB.setUser([...otherUsers,currentUser]);

    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'models', 'users.json'),
    //     JSON.stringify(userDB.users)
    // );
    


    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    // clearing the cookie syntax should be same as while setting cookie and maxAge ptoperty is optional
    res.clearCookie('jwt', refreshToken, {
        httpOnly : true,
            sameSite: 'None',
            secure: true,
            maxAge : 24 * 60 * 60 * 1000
    });
    res.sendStatus(204);

}

module.exports = {
    handleLogout
}