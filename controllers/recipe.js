const express = require("express");
const router = express.Router();

const Recipe = require("../models/recipe.js")
const User = require("../models/user.js");
const Ingredient = require("../models/ingredient.js");

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

router.get("/new", async (req, res) => {
    if(!req.session.user) {
        return res.redirect("/auth/sign-in");
    }
    try{
      const ingredients = await Ingredient.find({});
      res.render("recipes/new.ejs", {ingredients});
    } catch{
      console.error(error);
      res.redirect("/");
    }   
});

router.post("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/auth/sign-in");
    }
    const newRecipe = new Recipe(req.body);
    newRecipe.owner = req.session.user._id;
    if(req.body.ingredients){
      newRecipe.ingredients= Array.isArray(req.body.ingredients)? req.body.ingredients:[req.body.ingredients];
    }else{
      newRecipe.ingredients=[];
    }
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
    if (!recipe.owner.equals(req.session.user._id)) {
      return res.status(403).send("Unauthorized");
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
    if (!recipe.owner.equals(req.session.user._id)) {
      return res.status(403).send("Unauthorized");
    }
    const ingredients= await Ingredient.find({});
    res.render("recipes/edit.ejs",{ recipe, ingredients });
  } catch (error){
    console.error(error);
    res.redirect("/");
  }
});

router.put("/:recipeId", requireLogin, async (req, res) =>{
  try{
    const recipe = await Recipe.findById(req.params.id);
    if(!recipe){
      return res.status(404).send("Recipe not found");
    }
    if (!recipe.owner.equals(req.session.user._id)) {
      return res.status(403).send("Unauthorized");
    }
    if (req.body.name !== "") {
      recipe.name = req.body.name;
    }
    if (req.body.instructions !== "") {
      recipe.instructions = req.body.instructions;
    }
    if(req.body.ingredients){
      recipe.ingredients= Array.isArray(req.body.ingredients)? req.body.ingredients:[req.body.ingredients];
    }else{
      recipe.ingredients=[];
    }
    await recipe.save();
    res.redirect("/recipes/${recipe._id");
  }catch (error){
    console.error(error);
    res.redirect("/");
  }
});


module.exports = router;