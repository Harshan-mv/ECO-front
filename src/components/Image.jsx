import React from "react";

export const Image = ({ title, largeImage, smallImage }) => {
  return (
    <div className="position-relative overflow-hidden">
      <a
        href={largeImage}
        title={title}
        data-bs-toggle="lightbox"
        data-gallery="gallery1"
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center text-white opacity-0 hover-opacity-100 transition-opacity">
          <h4>{title}</h4>
        </div>
        <img src={smallImage} className="img-fluid" alt={title} />
      </a>
    </div>
  );
};
