function Header({ headerText, motto }) {
  return (
    <div className="page-header">
      <div className="row">

        <div className="col-lg-9">
          <h1>
            {headerText} <small>{motto}</small>
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
