const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    name: {type: String,
         required: true
        },
    instructions: String,
    owner: {type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
    ingredients:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient"
    }]
})

const Recipe = mongoose.model("Recipe", recipeSchema)
module.exports = Recipe;