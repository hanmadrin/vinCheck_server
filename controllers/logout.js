const logout = (req,res)=>{
    res.clearCookie('authkey');
    res.sendStatus(200);
};
module.exports = logout;