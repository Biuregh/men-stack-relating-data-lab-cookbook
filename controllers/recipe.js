const express = require("express");
const router = express.Router();

const Recipe = require("../models/recipe.js")
const User = require("../models/user.js");
const Ingredients = require("../models/ingredient.js");

router.get("/", async (req, res) => {
    try {
        const userId = req.session.user?._id;
        if (!userId) {
          return res.redirect("/auth/sign-in");
        }
        const recipes = await Recipe.find({ owner: userId });
        res.locals.recipes = recipes;
        res.render("recipes/index.ejs", { recipes, currentUserId: userId });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.get("/new", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/auth/sign-in");
    }
    res.render("recipes/new.ejs");
});

router.post("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/auth/sign-in");
    }
    const newRecipe = new Recipe(req.body);
    newRecipe.owner = req.session.user._id;
    await newRecipe.save();
    res.redirect("/recipes");
  } catch (error) {
    console.error("Error creating recipe:", error);
    res.redirect("/");
  }
});


module.exports = router;