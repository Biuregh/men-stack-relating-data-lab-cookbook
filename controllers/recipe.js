const express = require("express");
const router = express.Router();

const Recipe = require("../models/recipe.js")
const User = require("../models/user.js");
const Ingredients = require("../models/ingredient.js");

router.get("/", async (req, res) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) {
            return res.redirect("/sign-in");
        }
        const recipes = await Recipe.find({ owner: userId });
        res.render("recipes/index.ejs", { recipes });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.get('/new', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/sign-in');
    }
    res.render('recipes/new.ejs');
});


module.exports = router;