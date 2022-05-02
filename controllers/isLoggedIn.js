const User = require('../models/User');
const isLoggedIn = (req, res) => {
    const authkey = req.cookies.authkey;
    if(authkey){
        User.findOne({
            where: {
                authkey: authkey
            }
        }).then(user => {
            if(user){
                res.sendStatus(200);
            }else{
                res.sendStatus(401);
            }
        }).catch(err => {
            res.sendStatus(401);
        });
    }else{
        res.sendStatus(401);
    }
}
module.exports = isLoggedIn;