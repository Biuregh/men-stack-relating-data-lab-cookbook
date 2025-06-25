const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    name: {type: string,
         required: true
        },
    instructions: string,
    owner: {type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
    ingredients:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient"
    }
})

const Recipe = mongoose.model("Recipe", recipeSchema)
module.exports = Recipe;