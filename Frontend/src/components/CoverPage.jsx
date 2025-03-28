import React from "react";
import { Link } from "react-router-dom";
import styles from "./CoverPage.module.css";

const CoverPage = () => {
  return (
    <div className={styles.coverPageContainer}>
      <div
        className={styles.overlay} // Overlay for the dark filter
      ></div>

      <h1 className={styles.header}>Welcome to Academic Issue Tracking</h1>
      <p className={styles.subHeader}>Select your role to proceed:</p>

      <ul className={styles.roleSelection}>
        <li>
          <Link to="/student-login" className={styles.roleLink}>
            Student
          </Link>
        </li>
        <li>
          <Link to="/login?role=lecturer" className={styles.roleLink}>
            Lecturer
          </Link>
        </li>
        <li>
          <Link to="/login?role=academic-registrar" className={styles.roleLink}>
            Academic Registrar
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default CoverPage;
