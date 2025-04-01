import { Image } from "./Image";
import React from "react";

export const Gallery = (props) => {
  return (
    <div id="portfolio" className="text-center py-5">
      <div className="container">
        <div className="section-title mb-4">
          <h2>Gallery</h2>
          <p>
            EcoVision empowers users to take meaningful action for a greener future.
          </p>
        </div>
        <div className="row g-4">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} className="col-sm-6 col-md-4">
                  <Image
                    title={d.title}
                    largeImage={d.largeImage}
                    smallImage={d.smallImage}
                  />
                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    </div>
  );
};
