import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Header = (props) => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    const playAudio = async () => {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.warn("⚠️ Audio autoplay was blocked. User interaction may be required.");
      }
    };

    playAudio();
  }, []);

  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                <button
                  className="btn btn-custom btn-lg page-scroll"
                  onClick={() => navigate("/login")}
                >
                  GET STARTED
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Section */}
      <audio ref={audioRef} autoPlay muted={false} loop>
        <source src="/audio/ecovision-voi.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </header>
  );
};
