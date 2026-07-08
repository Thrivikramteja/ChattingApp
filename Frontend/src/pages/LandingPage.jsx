import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  return (
    <div className={styles.page}>
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.logo}>💬</div>
        <h1 className={styles.title}>ChatApp</h1>
        <p className={styles.subtitle}>
          Your conversations, always there when you need them.
        </p>
      </motion.div>

      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Link to="/signup">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" size="lg">
            Sign In
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
