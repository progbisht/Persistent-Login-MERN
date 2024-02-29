const allowedOrigins = require('./allowedOrigins');


// Cross Origin Resource Sharing requests
const corsOptions = {
    origin : (origin, callback) => {
        if( allowedOrigins.indexOf(origin) !== -1 || !origin ){
            callback(null, true);
        }
        else {
            callback(new Error("Not Allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus : 200
}


// ------- Important ------

// we may have errors with cors due to 
// const origin = req.headers.origin; 
// this can be figured out by
// res.header('Access-Control-Allow-Credentials', true);

module.exports = corsOptions