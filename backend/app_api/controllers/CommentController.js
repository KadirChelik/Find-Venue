const mongoose = require("mongoose");
const Venue = mongoose.model("venue"); 
const User = mongoose.model("user");

const getUser = async (req, res, callback) => {
  if (req.auth && req.auth.email) {
    try {
      const user = await User.findOne({ email: req.auth.email });
      callback(req, res, user.name);
    } catch (error) {
      createResponse(res, 400, { status: error.message }); // Hata mesajını döndür
    }
  } else {
    createResponse(res, 400, { status: "Token girilmedi" });
  }
};

const getComment = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.venueid).select("name comments").exec();

    if (!venue) {
      createResponse(res, 404, { status: "Venue not found" });
      return;
    }

    const comment = venue.comments.id(req.params.commentid);

    if (!comment) {
      createResponse(res, 404, { status: "Comment not found" });
    } else {
      const response = {
        venue: {
          name: venue.name,
          id: req.params.venueid,
        },
        comment: comment,
      };
      createResponse(res, 200, response);
    }
  } catch (error) {
    createResponse(res, 500, { status: "Internal Server Error" });
  }
};


var updateRating = function (venueid) {
  Venue.findById(venueid)
    .select("rating comments")
    .exec()
    .then(function (venue) {
      calculateLastRating(venue);
    });
};

var calculateLastRating = function (incomingVenue) {
  var i, numComments, avgRating, sumRating;
  if (incomingVenue.comments && incomingVenue.comments.length > 0) {
    numComments = incomingVenue.comments.length;
    sumRating = 0;
    for (i = 0; i < numComments; i++) {
      sumRating = sumRating + incomingVenue.comments[i].rating;
    }
    avgRating = Math.ceil(sumRating / numComments);
    incomingVenue.rating = avgRating;
    incomingVenue.save();
  }
};

const createComment = function (req, res, incomingVenue,author) {
  try {
    incomingVenue.comments.push({
      author:author,
      rating:req.body.rating,
      text:req.body.text
    });
    incomingVenue.save().then(function (venue) {
      var comment;
      updateRating(venue._id);
      comment = venue.comments[venue.comments.length - 1];
      createResponse(res, 201, comment);
    });
  } catch (error) {
    createResponse(res, 400, { status: "Yorum oluşturulamadı!" });
  }
};


const addComment = async function (req, res) {
  try {
    await getUser(req,res,(req,res,userName)=>{
      Venue.findById(req.params.venueid)
      .select("comments")
      .exec()
      .then((incomingVenue) => {
        createComment(req, res, incomingVenue,userName);
      });
    })
  } catch (error) {
    createResponse(res, 400, { status: "Yorum ekleme başarısız" });
  }
};

const deleteComment = async function (req, res) {
  try {
    await Venue.findById(req.params.venueid)
      .select("comments")
      .exec()
      .then(function (venue) {
        try {
          let comment = venue.comments.id(req.params.commentid);
          comment.deleteOne();
          venue.save().then(function () {
            createResponse(res, 200, {
              status: comment.author + " isimli kişinin yaptığı yorum silindi!",
            });
          });
        } catch (error) {
          createResponse(res, 404, { status: "Yorum bulunamadı!" });
        }
      });
  } catch (error) {
    createResponse(res, 400, { status: "Yorum silinemedi!" });
  }
};

const updateComment = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.venueid).select("comments").exec();

    if (!venue) {
      createResponse(res, 404, { status: "Venue not found" });
      return;
    }

    const comment = venue.comments.id(req.params.commentid);

    if (!comment) {
      createResponse(res, 404, { status: "Comment not found" });
    } else {
      comment.set(req.body);
      await venue.save();
      updateRating(venue._id);
      createResponse(res, 200, comment);
    }
  } catch (error) {
    createResponse(res, 500, { status: "Internal Server Error" });
  }
};


const createResponse = (res, status, content) => {
  res.status(status).json(content);
};


module.exports = {
  getComment,
  addComment,
  updateComment,
  deleteComment,
};
