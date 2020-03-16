var checkfile = {};
checkfile.image = function (req, res, next) {
    var flag = 1 ;
    req.files.forEach((file) => {
          if(!(file.originalname.endsWith(".jpeg") ||  file.originalname.endsWith(".jpg"))){
              flag = 0 
          }
    });


    if (req.files.length > 3) {
        req.flash("error", "Upload 3 Image files at MAX.");
        return res.redirect("back");
    }
    else if (flag == 0 ){
        req.flash("error", "Please upload .jpeg or .jpg files ONLY.");
        return res.redirect("back");

    }
    else {
        next();
    }

}

checkfile.pdf = function (req, res, next) {

    if (req.file.originalname.endsWith(".pdf")) {
        next();
    }
    else {

        req.flash("error", "Please upload .pdf file ONLY.");
        return res.redirect("back");
    }

}

checkfile.validate = function(req, res, next){
    if(!(req.body.Id.match(/\d{10}/)) || req.body.name.match(/[^a-z|A-z| ]+/)){
        req.flash("error", "Please enter valid values in the boxes.");
        return res.redirect("back");
    }
    else{
        next();
    }
}


module.exports = checkfile;