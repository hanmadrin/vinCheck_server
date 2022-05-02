const User = require('../models/User');
const authMiddleware = async(req,res,next) => {
    let user = false;
    try{
        user = await User.findOne({
            where: {
                authkey: req.cookies.authkey
            }
        });
    }catch(err){
        user = await User.findOne({
        where: {
            authkey: ''
        }
    });}
    
    if(user){
        next();
    }else{
        res.status(401).json();
    }
}
module.exports = authMiddleware;