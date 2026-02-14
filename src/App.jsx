import { useState } from "react";
import "./styles.css";

export default function App() {
  const [dark, setDark] = useState(false);

  const hands = dark
    ? "/hands-dark.png"
    : "/hands-light.png";

  return (
    <section className={`hero ${dark ? "dark" : "light"}`}>
      <div className={`grid ${dark ? "grid-dark" : "grid-light"}`} />

      <div
        className="hands-bg"
        style={{ backgroundImage: `url(${hands})` }}
      />

      <div className="nav">
        <span>Community</span>
        <span>Manifesto</span>
        <span>Download</span>
        <span>Sign in</span>

        <button className="toggle" onClick={() => setDark(!dark)}>
          {dark ? "☀" : "🌙"}
        </button>
      </div>

      <div className="content">
        <h1>
          Bringing people together in a <br />
          <span className="spaced">disconnected</span>
          <br /> world
        </h1>

        <p>
          Bridging the gap between online and offline,
          where real bonds are forged and nurtured
        </p>

        <button className={`btn ${dark ? "btn-light" : "btn-dark"}`}>
          Join the community
        </button>
      </div>
    </section>
  );
}
