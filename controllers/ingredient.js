const express= require("express");
const router= express.Router();

const User= require("../models/user.js");
const Ingredient= require("../models/ingredient.js")


router.get("/", async (req, res)=> {
    try {
        const ingredients= await Ingredient.find({});
        res.render("ingredients/index.ejs", { ingredients });
    } catch (error) {
        console.error(error);
        res.redirect("/");
    }
});

router.post("/", async (req, res)=> {
    try {
        const name= req.body.name.trim();
        const existing= await Ingredient.findOne({ name: new RegExp(`^${name}$`, "i") });
        if (existing) {
            return res.redirect("/ingredients");
        }
        await Ingredient.create({ name });
        res.redirect("/ingredients");
    } catch (error) {
        console.error(error);
        res.redirect("/ingredients");
    }
});


module.exports= router;