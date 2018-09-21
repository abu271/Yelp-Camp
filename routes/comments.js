let express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

//==========================
// COMMENTS ROUTES
//==========================

// NEW comments
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// comments create
router.post("/", middleware.isLoggedIn, function(req, res){
   // lookup cmapground using ID
   Campground.findById(req.params.id, function(err, campground){
      if(err){
          req.flash("error", "Something Wrong With The Data.");
          console.log(err);
          res.redirect("/campgrounds");
      } else{
          Comment.create(req.body.comment, function(err, comment){
             if(err){
                 console.log(err);
             } else{
                 // add username and id to comment
                 comment.author.username = req.user.username;
                 comment.author.id = req.user._id;
                 // save comment
                 comment.save();
                 campground.comments.push(comment);
                 campground.save();
                 req.flash("success", "Comment Created!");
                 res.redirect("/campgrounds/" + campground._id);
             }
          })
      }
   });
});

// EDIT COMMENTS ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Error Campground doesn't exist");
            res.redirect("/campgrounds");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
               res.redirect("back"); 
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// COMMENTS UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
          res.redirect("back");  
        } else {
           res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// COMMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    // remove comment
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    }) 
});



module.exports = router;
