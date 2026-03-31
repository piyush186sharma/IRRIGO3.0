import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader-wrapper">

        {/* 🌌 Stars (random across screen) */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              "--x": Math.random(),
              "--y": Math.random(),
              animationDelay: `${Math.random() * 2}s`,
              transform: `scale(${Math.random() * 1.5 + 0.5})`
            }}
          />
        ))}

        {/* 🔤 IRRIGO Text */}
        <div className="text">
          {"READY TO GO".split("").map((letter, i) => (
            <span key={i} className="loader-letter">
              {letter}
            </span>
          ))}
        </div>

        {/* 🔄 Circle Glow */}
        <div className="loader" />

      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 25px;

    font-family: "Inter", sans-serif;
    font-size: 1.5em;
    font-weight: 600;
    color: #fff;

    background: radial-gradient(circle at center, #001a0f, #000);
    z-index: 9999;
    overflow: hidden;
  }

  .text {
    display: flex;
    z-index: 2;
  }

  /* 🔄 Glowing rotating ring */
  .loader {
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    animation: loader-rotate 2s linear infinite;
    z-index: 1;
  }

  @keyframes loader-rotate {
    0% {
      transform: rotate(90deg);
      box-shadow:
        0 10px 20px #fff inset,
        0 20px 30px #fff5 inset,
        0 60px 60px #00ff88 inset;
    }
    50% {
      transform: rotate(270deg);
      box-shadow:
        0 10px 20px #fff inset,
        0 20px 10px #00ff88 inset,
        0 40px 60px #00ff8855 inset;
    }
    100% {
      transform: rotate(450deg);
      box-shadow:
        0 10px 20px #fff inset,
        0 20px 30px #fff5 inset,
        0 60px 60px #00ff88 inset;
    }
  }

  /* 🔤 Text animation */
  .loader-letter {
    opacity: 0.4;
    animation: loader-letter-anim 2s infinite;
    margin: 0.2em;
    filter: blur(1px);
  }

  .loader-letter:nth-child(1) { animation-delay: 0s; }
  .loader-letter:nth-child(2) { animation-delay: 0.1s; }
  .loader-letter:nth-child(3) { animation-delay: 0.2s; }
  .loader-letter:nth-child(4) { animation-delay: 0.3s; }
  .loader-letter:nth-child(5) { animation-delay: 0.4s; }
  .loader-letter:nth-child(6) { animation-delay: 0.5s; }
  .loader-letter:nth-child(7) { animation-delay: 0.6s; }

  @keyframes loader-letter-anim {
    0%, 100% {
      opacity: 0;
      transform: translateY(0);
      filter: blur(2px);
    }
    20% {
      opacity: 1;
      transform: scale(1.2) translateY(-2px);
      filter: blur(0);
      text-shadow:
        0 0 5px #fff,
        0 0 10px #00ff88;
    }
    40% {
      opacity: 0.7;
      transform: translateY(0);
      filter: blur(1px);
    }
  }

  /* 🌌 Stars */
  .star {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 8px #fff;

    top: calc(100% * var(--y));
    left: calc(100% * var(--x));

    opacity: 0.3;
    animation: star 2s infinite ease-in-out;
  }

  @keyframes star {
    0%, 100% {
      opacity: 0.2;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.8);
    }
  }
`;

export default Loader;