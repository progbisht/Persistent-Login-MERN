// const userDB = {
//     users : require('../models/users.json'),
//     setUser : function(data) { this.users = data }
// }

const User = require('../models/User');
const jwt = require('jsonwebtoken');


// method for accessing the access token based on the refresh token
const handleRefreshToken = async (req,res) => {
    const authCookies = req.cookies;

    // checking for the jwt property in cookie else the user is unauthorized
    if(!authCookies?.jwt) return res.sendStatus(401);

    const refreshToken = authCookies.jwt;

    // const foundUser = userDB.users.find(user => user.refreshToken === refreshToken);
    const foundUser = await User.findOne({ refreshToken : refreshToken }).exec();

    // if user is not exisiting user but still manages to have token then the the status should be Forbidden
    if(!foundUser) return res.sendStatus(403);  // Forbidden


    // if user is valid then allocating access token to user
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, verified) => {
            if(err || foundUser.username !== verified.username) return res.sendStatus(403);

            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                { 
                    "UserInfo" : {
                        "username" : verified.username,
                        "roles" : roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30s" }
            );

            res.send({ roles, accessToken });
        }
    )

}

module.exports = {
    handleRefreshToken
}