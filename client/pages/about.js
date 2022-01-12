import Link from "next/link";

const About = () => {
  return (
    <>
      <h2>About Us</h2>
      <p>
        Meme is an idea, behavior, or style that spreads by means of imitation
        from person to person within a culture and often carries symbolic
        meaning representing a particular phenomenon or theme. A meme acts as a
        unit for carrying cultural ideas, symbols, or practices, that can be
        transmitted from one mind to another through writing, speech, gestures,
        rituals, or other imitable phenomena with a mimicked theme
      </p>
      <hr />
      <h6>Created and Designed by PKC</h6>

      <a
        href="https://github.com/pkcheng"
        rel="noreferrer"
        target="_blank"
        className="btn btn-dark me-1"
        style={{ borderRadius: "50px" }}
      >
        <i className="bi bi-github" style={{ fontSize: "15pt" }}></i>
      </a>

      <a
        href="https://www.linkedin.com/in/pkcheng"
        rel="noreferrer"
        target="_blank"
        className="btn btn-dark"
        style={{ borderRadius: "50px" }}
      >
        <i className="bi bi-linkedin" style={{ fontSize: "15pt" }}></i>
      </a>
    </>
  );
};

export default About;
