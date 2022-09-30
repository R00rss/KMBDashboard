import React from "react";
import "./Loading.css";
const LoadingComponent = () => {
  return (
    <div id="font_loading" className="loading_container">
      <div className="content">
        <div className="load-5">
          <p>Procesando datos...</p>
          <div className="ring-2">
            <div className="ball-holder">
              <div className="ball"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
