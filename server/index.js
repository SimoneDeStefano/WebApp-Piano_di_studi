"use strict";

const express = require("express");
const cors = require("cors");
const CoursesDAO = require("./CoursesDAO"); // module for accessing the DB
const StudentDAO = require("./StudentsDAO");
const morgan = require("morgan"); // logging middleware
const { check, validationResult, checkSchema } = require("express-validator");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

// init express
const app = new express();
const port = 3001;
app.use(morgan("dev"));
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

//---------------------setUp autenticazione-------------------------------
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "not authenticated" });
};

passport.use(
  new LocalStrategy(function verify(username, password, callback) {
    StudentDAO.getStudent(username, password).then((user) => {
      if (!user)
        return callback(null, false, {
          message: "Incorrect username and/or passowrd",
        });

      return callback(null, user);
    });
  })
);

app.use(
  session({
    secret: "Pippo Baudo",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

passport.serializeUser((user, cb) => {
  cb(null, {
    id: user.Id,
    username: user.Username,
    Name: user.Name,
    FullTime: user.FullTime,
  });
});

passport.deserializeUser((user, cb) => {
  return cb(null, user);
});

//----------------------------APIs per login------------------

app.post("/api/login", passport.authenticate("local"), (req, res) => {
  res.json(req.user);
});

//logout
app.delete("/api/logout", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

//Check LoggedIn
//controlla se sono loggato o meno
app.get("/api/login/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});

//---------------------APIs su Courses-----------------------------------------//

// GET /api/courses
app.get("/api/courses", (req, res) => {
  CoursesDAO.getAll()
    .then((courses) => courses.filter((course) => course))
    .then((courses) => res.json(courses))
    .catch(() => res.status(500).end());
});

///---------------APIs su Incompatibility------------------------------------------//

// GET /api/incompatibility
app.get("/api/incompatibility", (req, res) => {
  CoursesDAO.getAllIncompatibility()
    .then((incompatibility) => incompatibility.filter((inco) => inco))
    .then((incompatibility) => res.json(incompatibility))
    .catch(() => res.status(500).end());
});

//-----------------------APIs su StudentForCourses-------------------------
//GET /api/coursesStudents
app.get("/api/coursesStudents", isLoggedIn, (req, res) => {
  CoursesDAO.getAllCoursesStudents(req.user.id)
    .then((coursesStudents) => coursesStudents.filter((cs) => cs))
    .then((coursesStudents) => res.json(coursesStudents))
    .catch(() => res.status(500).end());
});

// ----------------funzioni di controllo---------------------------//
function checkIncompatibility(incompa, codCourse, spp) {
  const inc = incompa.filter((el) => el.CourseCode === codCourse);
  for (let index = 0; index < spp.length; index++) {
    const element = spp[index];
    for (let i = 0; i < inc.length; i++) {
      const el = inc[i].Incompatibility;
      if (el === element) {
        return true;
      }
    }
  }
  return false;
}


function checkPropedeuticity(spBody, CourseCode, allCourses) {
  let element = {};
  for (let i = 0; i < allCourses.length; i++) {
    const el = allCourses[i];
    if (el.Code === CourseCode) {
      element = el
    }
  }

  for (let index = 0; index < allCourses.length; index++) {
    const courseProp = allCourses[index];
    if (courseProp.Code === element.Propaedeuticity) {
      for (let index2 = 0; index2 < spBody.length; index2++) {
        const courseproped2 = spBody[index2];
        if (courseproped2 === element.Propaedeuticity) return false;
      }
      return true;
    }
  }
  return false;
}

function isValidExam(CourseCode, allCourses) {
  if (allCourses.filter((i) => i.Code === CourseCode).length !== 0) {
    return false;
  } else {
    return true;
  }

}


//----------------------------------------------------------------//

//POST /api/newCourseStudent
app.post("/api/insertStudyPlan", isLoggedIn, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let Course;
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({ error: "Empty Body" });
    }
    const allCourses = await CoursesDAO.getAll();
    const incompati = await CoursesDAO.getAllIncompatibility();
    //controllo del ptft
    if (!(req.body.ptft == 0 || req.body.ptft == 1)) {
      return res.status(422).json({ error: "Incorrect Study Plane" });
    }
    for (let i = 0; i < req.body.CourseCode.length; i++) {
      if (req.body.CourseCode[i].length != 7) {
        return res.status(422).json({ error: "Incorrect Code" });
      }
      if (checkIncompatibility(incompati, req.body.CourseCode[i], req.body.CourseCode)) {
        return res.status(422).json({ error: "Incompatibility error" });
      }
      if (isValidExam(req.body.CourseCode[i], allCourses)) {
        return res.status(422).json({ error: " error exam not present in the course table " });
      }
      if (checkPropedeuticity(req.body.CourseCode, req.body.CourseCode[i], allCourses)) {
        return res.status(422).json({ error: " error propedeuticity" });
      }
    }


    await CoursesDAO.deleteStudyPlan(req.user.id);
    for (let i = 0; i < req.body.CourseCode.length; i++) {
      Course = req.body.CourseCode[i];
      await CoursesDAO.insertStudyPlan(Course, req.user.id);
    }
    await StudentDAO.updateFullTime(req.body.ptft, req.user.id);
    res.status(201).end();
  } catch (err) {
    console.log(err);
    res.status(503).json({
      error: `Database error during the insertion of exam.`,
    });
  }
});

// DELETE /api/courseStudent
app.delete("/api/deleteStudyPlan", isLoggedIn, async (req, res) => {
  try {
    await StudentDAO.updateFullTime(null, req.user.id);
    await CoursesDAO.deleteStudyPlan(req.user.id);
    res.status(204).end();
  } catch (err) {
    res.status(503).json({
      error: `Database error during the deletion of course.`,
    });
  }
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
