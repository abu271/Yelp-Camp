let Campground = require("../models/campground");
let Comment = require("../models/comment");

// all middleware goes here
let middlewareObj = {};

middlewareObj.checkCampOwnership = function(req, res, next){
    // is the user logged in
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                req.flash("Error", "Error 400 Campground doesn't exist.");
                res.redirect("back")
            } else {
                // does the user owned the campground
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("Error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in first!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is the user logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment doesn't exist");
                res.redirect("/campgrounds")
            } else {
                // does the user owned the comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be Logged in first!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    // middleware isLoggedIn
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in first!");
    res.redirect("/login");
}

module.exports = middlewareObj;