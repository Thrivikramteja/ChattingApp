import styles from "./Skeleton.module.css";

export default function Skeleton({ width, height, circle, className = "" }) {
  return (
    <div
      className={`${styles.skeleton} ${circle ? styles.circle : ""} ${className}`}
      style={{ width, height }}
    />
  );
}

export function RoomListSkeleton() {
  return (
    <div className={styles.list}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={styles.roomItem}>
          <Skeleton circle width={40} height={40} />
          <div className={styles.roomText}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessageListSkeleton() {
  return (
    <div className={styles.messages}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`${styles.message} ${i % 2 === 0 ? styles.left : styles.right}`}>
          <Skeleton width={`${40 + (i % 3) * 15}%`} height={36} />
        </div>
      ))}
    </div>
  );
}
