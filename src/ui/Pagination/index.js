import styles from "../../styles/Pagination.module.scss"; // Import the CSS module
import Dropdown from "../dropdown";

export default function Pagination({ page, take, total, onPageChange }) {
  const totalPages = Math.ceil(total / take);

  const handleClick = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => handleClick(page - 1)}
        disabled={page === 1}
        className={styles.pageButton}
      >
        &laquo;
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => handleClick(i + 1)}
          className={`${styles.pageButton} ${
            page === i + 1 ? styles.active : ""
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => handleClick(page + 1)}
        disabled={page === totalPages}
        className={styles.pageButton}
      >
        &raquo;
      </button>
    </div>
  );
}
