var fs = require("fs");
var dropboxV2Api = require("dropbox-v2-api");
var router = require("express").Router();

var checkfile = require("../middleware/checkfile");
var multer = require("multer");
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);}
 });

// var PDFFilter = function(req,file,callback){
//     if (!file.originalname.match(/\.(pdf)$/i)) {

//         return callback(new Error('Only PDF files are allowed!'), false);
//     }
//     callback(null, true);
// }

// var upload = multer({ storage: storage, fileFilter: PDFFilter});
var upload = multer({ storage: storage});


const dropbox = dropboxV2Api.authenticate({
  token: process.env.TOKEN
});


router.get("/pdf",(req,res)=>{

  res.render("pdf");

});


router.post("/pdf", upload.single("file"), checkfile.validate, checkfile.pdf,async function(req, res) {
 try{ dropbox(
    {
      resource: "files/upload",
      parameters: {
        path: "/uploads/pdf/"+req.body.name+req.body.Id+'.pdf'
      },
      readStream:fs.createReadStream(req.file.path),
    },
    (err, result) => {
      if (err) {
        res.send(err).end();
      }
      })
    req.flash("success","File Uploaded.Thank you for your submission.");
    res.redirect("/");
    }
    catch(err){
    res.send("Unknown Error Occurred.").end();
  }
  }); //use nodejs stream

module.exports = router;
