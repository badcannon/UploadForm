require("dotenv").config();

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var flash = require("connect-flash");


  app.use(flash());

  app.use(require("express-session")({
    secret: "asjdhajksd",
    resave: false,
    saveUninitialized: false
  }));

app.use(function(req, res ,next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})
app.use(express.static(__dirname + "/public"));

// routers :

var pdfRoute = require("./router/pdfrouter.js");
var imageRoute = require("./router/imageRouter.js");

app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

// use session ref to call API, i.e.:

app.get("/", (req, res) => {
  res.render("index");
});

app.use(pdfRoute);
app.use(imageRoute);

if (process.env.PORT || (process.env.PORT = 5000))
  app.listen(process.env.PORT, process.env.IP, () => {
    console.log("On port 5000 !");
  });
