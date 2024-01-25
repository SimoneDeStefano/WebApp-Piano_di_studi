import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import NavBar from "./NavBar";
import API from "./API";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, } from "react-router-dom";
import Courses from "./CoursesTable";
import { LoginForm } from "./LoginComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <App2 />
      </Router>
    </>
  );
}

function App2() {
  const [CoursesList, setCoursesList] = useState([]); //stato in cui carico i corsi(inizialmente vuoto)
  //questi 3 stati servono per il LogIn
  const [loggedIn, setLoggedIn] = useState(false); // no user is logged in when app loads
  const [user, setUser] = useState({});
  //uno stato per le incompatibilita(ci carico le incompatibilità)
  const [incompatibility, Setincompatibility] = useState([]);
  //stato per il piano di studi
  const [studyPlane, SetStudyPlane] = useState([]);
  const [studyPlaneProvvisory, SetStudyPlaneProvvisory] = useState([]);
  //modalita edit
  const [editMode, SetEditMode] = useState(false);
  //new study plane(setto la modalità)
  const [shownewPlane, SetShowNewPlane] = useState(false);
  //modalità del piano di studi
  const [typeofPlane, SetTypeOfPlane] = useState();
  //stato per il salvataggio
  const [save, SetSave] = useState(false);
  //delete row in study plan
  const [delet, SetDelete] = useState(false);

  const navigate = useNavigate();

  //delete studyPlan
  function deletePlan() {
    API.deleteStudyPlan()
      .then(() => {
        toast.success(
          "Successful cancellation of the study plan",
          {
            position: "top-center",
            theme: "dark",
            autoClose: 1000,
          }
        );
        SetEditMode(false);
        SetShowNewPlane(false);
        SetStudyPlane([]);
        SetStudyPlaneProvvisory([]);
        SetSave(!save);
        SetTypeOfPlane(null);
      })
      .catch((err) => handleError(err));
  }

  //saveStudyPlan
  function savePlan(studyplan) {
    studyplan.status = "saved";

    API.saveStudyPlan(studyplan)
      .then(() => {
        toast.success("Salvataggio avvenuto con successo", {
          position: "top-center",
          theme: "dark",
          autoClose: 1000,
        });
        SetEditMode(false);
        SetShowNewPlane(false);
        SetSave(!save);
        SetStudyPlane(studyPlaneProvvisory);
        SetTypeOfPlane(studyplan.ptft);
      })
      .catch((err) => {
        handleError(err);
        toast.error("I dati passati non sono coretti ", {
          position: "top-center",
          theme: "dark",
          autoClose: 1000,
        });
      })
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        handleError(err);
      }
    };
    checkAuth();
  }, []);

  function handleError(err) {
    console.log(err);
  }

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then((user) => {
        setLoggedIn(true);
        setUser(user);
        toast.info(`Hello ${user.Name}`, {
          position: "top-center",
          theme: "dark",
          autoClose: 2000,
        });
        if (user.FullTime === null) {
          SetTypeOfPlane(null);
        } else {
          SetTypeOfPlane(user.FullTime);
        }
        navigate("/");
      })
      .catch((err) => {
        toast.warning(`Username e/o password errate`, {
          position: "top-center",
          theme: "dark",
          autoClose: 2000,
        });
      });
  };

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    SetStudyPlane([]);
    SetEditMode(false);
    SetShowNewPlane(false);
  };

  useEffect(() => {
    // fetch  /api/courses
    API.getAllCourses()
      .then((courses) => {
        setCoursesList(courses);
      })
      .catch((err) => console.log(err));

    // fetch  /api/incompatibility
    API.getAllIncompatibility()
      .then((incompatibility) => {
        Setincompatibility(incompatibility);
      })
      .catch((err) => console.log(err));
  }, [save]);

  useEffect(() => {
    // fetch  /api/coursesStudents
    API.getStudyPlane()
      .then((studyPlane) => {
        SetStudyPlane(studyPlane);
        SetStudyPlaneProvvisory(studyPlane);
      })
      .catch((err) => console.log(err));
  }, [loggedIn]);

  return (
    <>
      <ToastContainer></ToastContainer>
      <NavBar
        loggedIn={loggedIn}
        login={doLogIn}
        logout={doLogOut}
        user={user}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Courses
              CoursesList={CoursesList}
              loggedIn={loggedIn}
              incompatibility={incompatibility}
              studyPlane={studyPlane}
              user={user}
              editMode={editMode}
              SetEditMode={SetEditMode}
              SetStudyPlane={SetStudyPlane}
              studyPlaneProvvisory={studyPlaneProvvisory}
              SetStudyPlaneProvvisory={SetStudyPlaneProvvisory}
              shownewPlane={shownewPlane}
              SetShowNewPlane={SetShowNewPlane}
              typeofPlane={typeofPlane}
              SetTypeOfPlane={SetTypeOfPlane}
              savePlan={savePlan}
              deletePlan={deletePlan}
              delet={delet}
              SetDelete={SetDelete}
            />
          }
        />
        <Route
          path="/login"
          element={
            loggedIn ? <Navigate to="/" /> : <LoginForm login={doLogIn} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
