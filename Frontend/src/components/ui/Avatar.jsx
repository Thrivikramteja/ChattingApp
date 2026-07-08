import styles from "./Avatar.module.css";

export default function Avatar({ src, name, size = "md", online }) {
  const fallback = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(name || "user")}`;

  return (
    <div className={`${styles.avatar} ${styles[size]}`}>
      <img src={src || fallback} alt={name || "Avatar"} className={styles.image} />
      {online !== undefined && (
        <span className={`${styles.status} ${online ? styles.online : styles.offline}`} />
      )}
    </div>
  );
}
