"use strict";

const sqlite = require("sqlite3");
const crypto = require("crypto");
const { resolve } = require("path");

// open the database
const db = new sqlite.Database("pianoDiStudi.sqlite", (err) => {
  if (err) throw err;
});

//OPERAZIONI SULLA TABELLA STUDENTS
//Anche qui dovrebbe servirmi solo la get dato che non devo ne aggiungere ne eliminare studenti

//get all students
exports.getAllStudent = () => {
  const sql = "SELECT * FROM Students";
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const students = rows.map((s) => ({
        ID: s.ID, //nome nel body della richiesta : nomeVariabile.NomeVariabilenelDATABASE
        Name: s.Name,
        Surname: s.Surname,
        UserName: s.UserName,
        Password: s.Password,
        FullTime: s.FullTime,
      }));
      resolve(students);
    });
  });
};

//get student by usarname and password
exports.getStudent = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Students WHERE UserName = ?";
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const student = {
          Id: row.ID,
          Username: row.UserName,
          Name: row.Name,
          Surname: row.Surname,
          FullTime: row.FullTime,
        };
        const salt = row.Salt;
        crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
          if (err) reject(err);
          const passwordHex = Buffer.from(row.Password, "hex");
          if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
            resolve(false);
          else resolve(student);
        });
      }
    });
  });
};

exports.updateFullTime = (ptft, id) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE Students SET FullTime = ? WHERE  ID = ?";
    db.run(sql, [ptft, id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};
