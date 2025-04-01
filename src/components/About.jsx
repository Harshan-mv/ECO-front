import React from "react";

export const About = (props) => {
  return (
    <div id="about" className="py-5">
      <div className="container">
        <div className="row g-4 align-items-center">
          {/* Image Section with Black Border */}
          <div className="col-md-6">
            <img 
              src="img/about.jpg" 
              className="img-fluid rounded shadow-sm border border-dark" 
              alt="About Us" 
            />
          </div>

          {/* Text Section */}
          <div className="col-md-6">
            <div className="about-text">
              <h2 className="mb-4">About Us</h2>
              <p>{props.data ? props.data.paragraph : "Loading..."}</p>

              {/* Why Choose Us Section */}
              <h3 className="mt-4">Why Choose Us?</h3>
              <div className="row">
                <div className="col-6">
                  <ul className="list-unstyled">
                    {props.data
                      ? props.data.Why.map((d, i) => (
                          <li key={`${d}-${i}`}>✅ {d}</li>
                        ))
                      : "Loading..."}
                  </ul>
                </div>

                <div className="col-6">
                  <ul className="list-unstyled">
                    {props.data
                      ? props.data.Why2.map((d, i) => (
                          <li key={`${d}-${i}`}>✅ {d}</li>
                        ))
                      : "Loading..."}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
