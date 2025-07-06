import "./Preloader.css";

const Preloader = ({ title }) => {
  return (
    <div className="preloader">
      <div className="loader">
        <div className="loader__figure"></div>
        <p className="loader__label">{title}</p>
      </div>
    </div>
  );
};

export default Preloader;
