import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "../styles/index.module.scss";

const Gift: React.FC = () => {
  return (
    <motion.section
      className={styles.ice}
      style={{ textAlign: "center" }}
      initial={{ opacity: 0, scale: 0.8, y: -50 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.8, y: 50 }} 
      transition={{ duration: 0.9, ease: "easeInOut" }} 
    >
      <h2>¡Felicidades! <br />¡Has Ganado un Helado!</h2>
      <picture>
        <Image src="/logo.png" alt="Gift" width={320} height={230} priority />
      </picture>
    </motion.section>
  );
};

export default Gift;

