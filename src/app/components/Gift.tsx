import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import styles from "../styles/index.module.scss";

const Gift: React.FC<{ onReturn: () => void }> = ({ onReturn }) => {
  return (
    <div className={styles.ice} style={{ textAlign: "center" }}>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        ¡Felicidades! ¡Has Ganado un Helado!
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
      >
        <Image src="/hd.png" alt="Gift" width={350} height={350} priority />
      </motion.div>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onReturn}
      >
        Volver a capturar decibelios
      </motion.button>
    </div>
  );
};

export default Gift;


// import React from 'react';
// import Image from 'next/image';

// const Gift: React.FC<{ onReturn: () => void }> = ({ onReturn }) => {
//   return (
//     <div style={{ textAlign: "center" }}>
//       <h2>¡Felicidades! ¡Has alcanzado el límite de decibeles!</h2>
//       <Image src="/hd.png" alt="Gift" width={150} height={150} priority />
//       <button onClick={onReturn}>Volver a capturar decibelios</button>
//     </div>
//   );
// };

// export default Gift;