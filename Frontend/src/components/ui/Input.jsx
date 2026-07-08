import styles from "./Input.module.css";

export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={props.id || props.name} className={styles.label}>
          {label}
        </label>
      )}
      <input className={`${styles.input} ${error ? styles.error : ""} ${className}`} {...props} />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
