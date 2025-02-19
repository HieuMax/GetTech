import React from "react";
import { useInView } from "react-intersection-observer";
// import "./FadeInSection.css";

const FadeInSection = ({ children }) => {
  const { ref, inView } = useInView({
    threshold: 0.2,    // Adjust this value to control when the animation triggers
    triggerOnce: true, // The animation will only happen once
  });

  return (
    <div ref={ref} className={`fade-in-section ${inView ? "is-visible" : ""}`}>
      {children}
    </div>
  );
};

export default FadeInSection;
