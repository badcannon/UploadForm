var fs = require("fs");

var dropboxV2Api = require("dropbox-v2-api");
var router = require("express").Router();
var checkfile = require("../middleware/checkfile");
var multer = require("multer");
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

// var imageFilter = function(req, file, callback) {
//   if (!file.originalname.match(/\.(jpg|jpeg)$/i)) {
//     return callback(new Error("Only image files are allowed!"), false);
//   }
//   callback(null, true);
// };

// var upload = multer({ storage: storage, fileFilter: imageFilter, limits: {files: 3}});
var upload = multer({ storage: storage});


const dropbox = dropboxV2Api.authenticate({
  token: process.env.TOKEN
});

router.get("/images", (req, res) => {
  res.render("images");
});



router.post("/images", upload.array("images"),checkfile.validate, checkfile.image, async function(req, res, err) {
    try{
        await req.files.forEach(file => {
        const uploadStream = dropbox(
        {
          resource: "files/upload",
          parameters: {
            mode : 'overwrite',
            path:
              "/uploads/images/" + 
              req.body.Id +
              req.body.name +
              "/" + file.originalname
          }
        },
        (err, result, response) => {
          if (err) {
            res.send(err).end();
          }
          });
        
        fs.createReadStream(file.path).pipe(uploadStream);
      }
    );
    req.flash("success","Images uploaded. Thank you for your submission !");
    res.redirect("/");
  } catch (error) {
    res.send("Unknown Error Occurred.").end();
  }
});

module.exports = router;
