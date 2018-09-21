let express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");

// INDEX ROUTE - show all campgrounds
router.get("/campgrounds", function(req, res){
    // Get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE ROUTE - add new campground to db
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
   // get data from form and add to campground array
   let name = req.body.name;
   let price = req.body.price;
   let image = req.body.image;
   let desc = req.body.description;
   let author = {
       id: req.user._id,
       username: req.user.username
   }
   let newCampground = {name: name, price: price, image: image, description: desc, author: author};
   
   // Create a new campground and save to db
   Campground.create(newCampground, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else{
           // redirect to campgrounds page
           res.redirect("/campgrounds"); 
       }       
   });
});

// NEW ROUTE - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new")
});

// SHOW ROUTE - shows info about a specific campground
router.get("/campgrounds/:id", function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
       if(err || !foundCampground){
           req.flash("error", "Item not found.");
           res.redirect("/campgrounds");
       } else{
           // render show template with that campground
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err || !foundCampground) {
            return res.status(400).send("Item not found.")
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND
router.put("/campgrounds/:id", middleware.checkCampOwnership, function(req, res){
   // find and update
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds/" + req.params.id)
      }
   });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;