const APIURL = new URL("http://localhost:3001/api/");

//---------------------Users APIs------------------
async function logIn(credentials) {
  let response = await fetch(new URL("login", APIURL), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(new URL("logout", APIURL), {
    method: "DELETE",
    credentials: "include",
  });
}

async function getUserInfo() {
  const response = await fetch(new URL("login/current", APIURL), {
    credentials: "include",
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo; // an object with the error coming from the server
  }
}

//----------------------------Courses APIs---------------------------
async function getAllCourses() {
  // call: GET /api/courses
  const response = await fetch(new URL("courses", APIURL), {
    credentials: "include",
  });
  const coursesJson = await response.json();
  if (response.ok) {
    return coursesJson.map((co) => ({
      code: co.Code,
      name: co.Name,
      CFU: co.CFU,
      MaxStudents: co.MaxStudents,
      NumStudents: co.NumStudents,
      Propaedeuticity: co.Propaedeuticity,
    }));
  } else {
    throw coursesJson; // an object with the error coming from the server
  }
}

//-----------------------------Incompatibility APIs----------------------
async function getAllIncompatibility() {
  // call: GET /api/incompatibility
  const response = await fetch(new URL("incompatibility", APIURL), {
    credentials: "include",
  });
  const incompatibilityJson = await response.json();
  if (response.ok) {
    return incompatibilityJson.map((i) => ({
      courseCode: i.CourseCode,
      incompatibility: i.Incompatibility,
    }));
  } else {
    throw incompatibilityJson; // an object with the error coming from the server
  }
}
//-------------------------StudyPlane APIs-------------------------------------------
async function getStudyPlane() {
  // call: GET /api/incompatibility
  const response = await fetch(new URL("coursesStudents", APIURL), {
    credentials: "include",
  });
  const studyPlaneJson = await response.json();
  if (response.ok) {
    return studyPlaneJson.map((sp) => ({
      courseCode: sp.CourseCode,
      IDStudent: sp.IDStudent,
    }));
  } else {
    throw studyPlaneJson; // an object with the error coming from the server
  }
}

async function saveStudyPlan(studyplan) {
  //call : POST /api/insertStudyPlan
  return new Promise((resolve, reject) => {
    fetch(new URL("insertStudyPlan", APIURL), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CourseCode: studyplan.codeCourses,
        ptft: studyplan.ptft,
      }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject(message);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
}

function deleteStudyPlan() {
  // call: DELETE /api/deleteStudyPlan
  return new Promise((resolve, reject) => {
    fetch(new URL("deleteStudyPlan", APIURL), {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject(message);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
}

const API = {
  logIn,
  logOut,
  getUserInfo,
  getAllCourses,
  getAllIncompatibility,
  getStudyPlane,
  saveStudyPlan,
  deleteStudyPlan,
};
export default API;
