const express = require("express");
const router = express.Router();

const Recipe = require("../models/recipe.js")
const User = require("../models/user.js");
const Ingredients = require("../models/ingredient.js");

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth/sign-in");
  }
  next();
}

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

router.get("/:recipeId", async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.redirect("/");
    }
    res.locals.recipe = recipe;
    res.render("recipes/show.ejs");
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});
router.delete("/:recipeId", requireLogin, async (req, res) => {
  try {
    const recipe= await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }
    await recipe.deleteOne();
    res.redirect("/recipes");
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

router.get("/:recipeId/edit", requireLogin, async (req, res) =>{
  try{
    const recipe = await Recipe.findById(req.params.recipeId);
    if(!recipe) {
      return res.status(404).send("Recipe not found");
    }
    res.render("recipes/edit.ejs",{ recipe });
  } catch (error){
    console.error(error);
    res.redirect("/");
  }
});

router.put("/:id", requireLogin, async (req, res) => {
  try{
    const recipe = await Recipe.findById(req.params.id);
    if(!recipe){
      return res.status(404).send("Recipe not found");
    }
    if (req.body.name !== "") {
      recipe.name = req.body.name;
    }
    if (req.body.instructions !== "") {
      recipe.instructions = req.body.instructions;
    }
    await recipe.save();
    res.redirect("/recipes");
  }catch (error){
    console.error(error);
    res.redirect("/recipes");
  }
});


module.exports = router;