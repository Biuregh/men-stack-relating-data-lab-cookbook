const express= require("express");
const router= express.Router();

const User= require("../models/user.js");
const Recipe = require('../models/recipe.js');


router.get("/", async (req, res)=> {
  try{
    const users= await User.find({});
    res.render("users/index.ejs", { users });
  } catch(error) {
    console.error(error);
    res.redirect("/");
  }
});

router.get("/:userId", async (req, res)=> {
  try {
    const userId= req.params.userId;
    const user= await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const recipes= await Recipe.find({ owner: user._id });
    res.render("users/show.ejs", { user, recipes });
  } catch (error) {
    console.error(error);
    res.redirect("/users");
  }
});

module.exports= router;