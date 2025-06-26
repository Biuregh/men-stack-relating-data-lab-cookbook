const isSignedIn = (req,res)=>{
    if(req.session.user) return next();
    res.redirect("/auth/sign-in")
}

module.exports=isSignedIn;