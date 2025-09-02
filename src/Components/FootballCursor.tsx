import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import football from "../assets/football.png"; 


const FootballCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const moveHandler = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", moveHandler);

    return () => {
      window.removeEventListener("mousemove", moveHandler);
    };
  }, []);

  return (
    <motion.img
      src={football}
      alt="Football Cursor"
      className="pointer-events-none fixed w-10 h-10 z-[9999]"
      animate={{ x: position.x - 0, y: position.y - 0, rotate: position.x }}
      transition={{
        type: "spring",
        stiffness:150,
        damping: 20,
        mass: 0.5,
      }}
    />
  );
};

export default FootballCursor;
