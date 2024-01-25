"use strict";

const sqlite = require("sqlite3");

// open the database
const db = new sqlite.Database("pianoDiStudi.sqlite", (err) => {
  if (err) throw err;
});

//OPERAZIONI SULLA TABELLA COURSES

//get all courses
exports.getAll = () => {
  const sql =
    "SELECT C.Code , C.Name , C.CFU ,C.MaxStudents,C.Propaedeuticity , COUNT(SC.CourseCode) as numStud FROM Courses C LEFT JOIN StudentsForCourse SC ON C.Code = SC.CourseCode GROUP BY C.Code  ORDER BY Name ASC";
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const courses = rows.map((c) => ({
        Code: c.Code, //nome nel body della richiesta : nomeVariabile.NomeVariabilenelDATABASE
        Name: c.Name,
        CFU: c.CFU,
        MaxStudents: c.MaxStudents,
        NumStudents: c.numStud,
        Propaedeuticity: c.Propaedeuticity,
      }));
      resolve(courses);
    });
  });
};

//OPERAZIONI SULLA TABELLA INCOMPATIBILITY

// get all incompatibility
exports.getAllIncompatibility = () => {
  const sql = "SELECT * FROM Incompatibility";
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const incompatibility = rows.map((i) => ({
        CourseCode: i.CourseCode,
        Incompatibility: i.CodeIncompatibility,
      }));
      resolve(incompatibility);
    });
  });
};

//OPERAZIONI SULLA TABELLA STUDENTFORCOURSE

//get tutti i corsi per studenti
exports.getAllCoursesStudents = (studentID) => {
  const sql = "SELECT * FROM StudentsForCourse WHERE IDStudent = ? ";
  return new Promise((resolve, reject) => {
    db.all(sql, [studentID], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const CoursesStudents = rows.map((cs) => ({
        CourseCode: cs.CourseCode,
        IDStudent: cs.IDStudent,
      }));
      resolve(CoursesStudents);
    });
  });
};

//inserisco un nuovo esame per uno studente
exports.insertStudyPlan = (Course, id) => {
  const sql =
    "INSERT INTO StudentsForCourse(CourseCode, IDStudent) VALUES(?,?)";
  return new Promise((resolve, reject) => {
    db.run(sql, [Course, id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

//cancello gli esami per uno studente
exports.deleteStudyPlan = (dcs) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE from StudentsForCourse WHERE  IDStudent = ?";
    db.run(sql, [dcs], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(null);
    });
  });
};
