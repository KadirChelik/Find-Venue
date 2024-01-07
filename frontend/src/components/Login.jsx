import React, { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import AdminButton from "./AdminButton";
import VenueDataService from "../services/VenueDataService";

function Login({ setAuthControl, setTokenCtrl,setCommentName }) {
  const navigate = useNavigate();
  const [BtnName, setBtnName] = useState("");

  const performClick = (evt, btnName) => {
    if (btnName === "Giriş Yap") {
      evt.preventDefault();
      const emailValue = evt.target.elements.email.value;
      const passwordValue = evt.target.elements.password.value;
      if (!emailValue || !passwordValue) {
        alert("Değerler boş olamaz!");
        return;
      }
      const UserData = {
        email: emailValue,
        password: passwordValue,
      };
      VenueDataService.login(UserData)
        .then((response) => {
          console.log("Giriş Başarılı");
          setCommentName(response.data.name);
          setTokenCtrl(response.data.token);
          setAuthControl(true);
          navigate("/admin");
        })
        .catch((error) => {
          alert("Giriş Başarısız");
          console.error("Başarısız ", error);
        });
    }
    if (btnName === "Kayıt Ol") {
      navigate("/signup");
    }
  };
  return (
    <div className="container">
      <Header
        headerText="Mekanbul"
        motto="Giriş Yap"
      />
      <form className="form-horizontal " onSubmit={(evt) => performClick(evt,BtnName)}>
        <div className="form-group">
          <label className="col-xs-10 col-sm-2 control-label">E-Posta:</label>
          <div className="col-xs-10 col-sm-8">
            <input
              className="form-control"
              name="email"
              defaultValue={"kadircelik@gmail.com"}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-xs-10 col-sm-2 control-label">Şifre:</label>
          <div className="col-xs-10 col-sm-8">
            <input
              className="form-control"
              name="password"
              defaultValue={"12345"}
              type="password"
            />
          </div>
        </div>
        <div className="log-btn">
          <AdminButton
            name="Giriş Yap"
            type="primary"
            onClick={() => {
              setBtnName("Giriş Yap");
            }}
          />
          <AdminButton
            name="Kayıt Ol"
            type="white"
            onClick={() => {
              setBtnName("Kayıt Ol");
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default Login;
