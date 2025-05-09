import { useState, useEffect } from "react";
import styles from "../styles/dropdown.module.scss"; // Import the CSS module

export default function Dropdown({
  label,
  options = [],
  onSelect,
  placeholder = "Select an option",
  defaultValue = null, // Add defaultValue prop
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue); // Initialize with defaultValue

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.header} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selected || placeholder}
        <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <ul className={styles.list}>
          {options.map((option, idx) => (
            <li
              key={idx}
              className={styles.item}
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
