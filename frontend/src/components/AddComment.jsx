import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import VenueReducer from "../services/VenueReducer";
import VenueDataService from "../services/VenueDataService";
import Header from "./Header";
import React, { useEffect } from "react";

function AddComment({ authControl, tokenCtrl ,CommentName }) {

  const navigate = useNavigate();

  useEffect(() => {
    if (!authControl) {
      navigate("/login");
    }
  }, [authControl, navigate]);

  const { id } = useParams();

  let location = useLocation();

  const [comment, dispatchComment] = React.useReducer(VenueReducer, {
    data: {},
    isSuccess: false,
    isError: false,
  });

  const onSubmit = (evt, token) => {
    evt.preventDefault();
    if (
      evt.target.elements.rating.value &&
      evt.target.elements.text.value
    ) {
      var newComment = {
        author: CommentName,
        rating: evt.target.elements.rating.value,
        text: evt.target.elements.text.value,
      };
      VenueDataService.addComment(id, newComment, token).then(() => {
        console.log("Yorum Ekleme Başarılı")
        dispatchComment({ type: "ADD_COMMENT_SUCCESS" });
      });
    } else {
      dispatchComment({ type: "ADD_COMMENT_FAILURE" });
    }
  };

  if (comment.isSuccess) {
    return navigate(`/venue/${id}`);
  }

  return (
    <>
      <Header headerText={location.state.name} motto=" mekanına yorum yap" />
      {comment.isError && (
        <>
          <div className="error-header">
            {" "}
            <b>Tüm alanlar zorunludur!</b>
          </div>
        </>
      )}

      <div className="row">
        <div className="col-xs-12 col-md-6">
          <form
            className="form-horizontal"
            id="yorumEkle"
            onSubmit={(evt) => onSubmit(evt, tokenCtrl)}
          >
            <div className="form-group">
              <label className="col-xs-10 col-sm-2 control-label">Puan:</label>
              <div className="col-xs-12 col-sm-2">
                <select
                  className="form-control input-sm"
                  id="rating"
                  name="rating"
                >
                  <option>5</option>
                  <option>4</option>
                  <option>3</option>
                  <option>2</option>
                  <option>1</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">Yorum:</label>
              <div className="col-sm-10">
                <textarea
                  className="review form-control"
                  name="text"
                  rows={5}
                />
              </div>
            </div>
            <button className="btn btn-default pull-right">Yorum Ekle</button>
          </form>
        </div>
      </div>
    </>
  );
}
export default AddComment;
