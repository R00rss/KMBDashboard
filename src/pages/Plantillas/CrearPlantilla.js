import React from "react";
import { useState } from "react";
import styles from "./CrearPlantilla.module.css";
import deleteIcon from "../../img/icons/close.png";
import addIcon from "../../img/icons/plus.png";
import { useEffect } from "react";
import FailPage from "../FailPage";

const CrearPlantilla = () => {
  const [titles, setTitles] = useState([]);
  const [subtitles, setSubtitles] = useState([]);
  const validate = sessionStorage.getItem("Validate");
  const statusUser = parseInt(sessionStorage.getItem("Status"));

  const handleChange = (e, i, setfunction, array) => {
    // subtitles[i] = e.target.value;
    const temp = [...array];
    temp[i] = e.target.value;
    setfunction(temp);
  };

  const handleDelete = (i, setfunction, array) => {
    const temp = [...array];
    temp.splice(i, 1);
    setfunction(temp);
  };

  useEffect(() => {
    console.log("subtitles", subtitles);
  }, [subtitles]);
  useEffect(() => {
    console.log("titles", titles);
  }, [titles]);

  return (
    <>
      {statusUser === 1 || statusUser === 2 ? (
        <div className={styles.container}>
          <div className={styles.titles}>
            {titles.map((value, i) => (
              <div className={styles.center} key={i}>
                <input
                  className={styles.submenuItem}
                  id={i}
                  value={value}
                  type="text"
                  placeholder="test"
                  onChange={(e) => handleChange(e, i, setTitles, titles)}
                />
                <img
                  className={styles.icon}
                  src={deleteIcon}
                  onClick={() => handleDelete(i, setTitles, titles)}
                />
              </div>
            ))}
            <img
              className={styles.icon}
              src={addIcon}
              onClick={() => setTitles(titles.concat(""))}
            />
          </div>
          <div className={styles.submenu}>
            {subtitles.map((value, i) => (
              <div className={styles.center} key={i}>
                <input
                  className={styles.submenuItem}
                  id={i}
                  value={value}
                  type="text"
                  placeholder="test"
                  onChange={(e) => handleChange(e, i, setSubtitles, subtitles)}
                />
                <img
                  className={styles.icon}
                  src={deleteIcon}
                  onClick={() => handleDelete(i, setSubtitles, subtitles)}
                />
              </div>
            ))}
            <img
              className={styles.icon}
              src={addIcon}
              onClick={() => setSubtitles(subtitles.concat(""))}
            />
          </div>
        </div>
      ) : (
        <FailPage />
      )}
    </>
  );
};

export default CrearPlantilla;
