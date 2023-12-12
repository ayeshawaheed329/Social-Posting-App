

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>{

    const token = req?.get('Authorization')?.split(" ")?.[1];

    let decodedToken;
    try{
        decodedToken = jwt.verify(token, 'secreetKey');
    }
    catch( error ){
        error.statusCode = 500;
        throw error;
    }
    if(!decodedToken){    // not verified
        const error = new Error('Authenticatin failed');
        error.statusCode = 401;
        throw error;
    }
    console.log("decodedToken ",decodedToken);
    req.userId = decodedToken?.userId;
    next();
};

