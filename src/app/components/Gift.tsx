import React from "react";
import Image from "next/image";
import styles from "../styles/index.module.scss";

const Gift: React.FC = () => {
  return (
    <section className={styles.ice} style={{ textAlign: "center" }}>
      <h2>¡Felicidades! <br></br>¡Has Ganado un Helado!</h2>
      <picture>
        <Image src="/logo.png" alt="Gift" width={400} height={300} priority />
      </picture>
    </section>
  );
};

export default Gift;
