const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');
const authController = require('./controllers/auth.js');
const ingredientsController = require("./controllers/ingredient.js");
const recipeController = require("./controllers/recipe.js");


const port = process.env.PORT ? process.env.PORT : '4000';

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use("/ingredients", ingredientsController);
app.use("/recipe", recipeController);


app.get('/', (req, res) => {
  const loggedInUser= req.session.user || null;
  res.render('index.ejs');
});

app.use('/auth', authController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});