import { Button, Table, Card, Collapse, Container, Row, Col, } from "react-bootstrap";
import { BsInfoLg } from "react-icons/bs";
import { IoAdd } from "react-icons/io5";
import { useState } from "react";
import StudyPlane from "./StudyPlane";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//------------funzioni di controllo--------------------------//

function checkEsamigiapresentinelpianodiStudi(spp, codCourse) {
  for (let index = 0; index < spp.length; index++) {
    const element = spp[index].courseCode;
    if (element === codCourse) {
      return true; //spegne il pulsante
    }
  }
  return false; //accende il pulsante
}

function checkIncompatibility(incompa, codCourse, spp) {
  const inc = incompa.filter((el) => el.courseCode === codCourse);
  for (let index = 0; index < spp.length; index++) {
    const element = spp[index].courseCode;
    for (let i = 0; i < inc.length; i++) {
      const el = inc[i].incompatibility;
      if (el === element) {
        return true;
      }
    }
  }
  return false;
}

function checkPropedeuticity(spp, codPropaedeuticity) {
  if (codPropaedeuticity === null) return false;
  for (let i = 0; i < spp.length; i++) {
    if (spp[i].courseCode === codPropaedeuticity) {
      return false;
    }
  }
  return true;
}

function checkMaxStudent(Nums, maxStudents) {
  if (maxStudents == undefined) return false;
  if (Nums >= maxStudents) return true;
  return false;
}

function checkCFUSuperati(cfuTotali, FullTime, CourseCFU) {
  if (FullTime) {
    if (cfuTotali + CourseCFU > 80) {
      return true;
    }
    return false;
  } else {
    if (cfuTotali + CourseCFU > 40) {
      return true;
    }
    return false;
  }
}

//--------------------------------------------//

function Courses(props) {

  //--------------------------//
  function CalcoloCFU(codeExa, plan) {
    const codeExam = codeExa.map((it) => it);
    const plane = plan.map((sp) => sp);
    let cfu = 0;
    plane.forEach((element) => {
      codeExam.forEach((el) => {
        if (element.courseCode === el.code) cfu = cfu + el.CFU;
      });
    });
    return cfu;
  }
  //---------------------------------------//

  return (
    <>
      {props.loggedIn ? (
        <>
          <ToastContainer></ToastContainer>
          <Container fluid>
            <Row>
              <Col>
                <h1 align="center">
                  <i>Courses</i>
                </h1>
                <CoursesTable
                  CoursesList={props.CoursesList}
                  loggedIn={props.loggedIn}
                  incompatibility={props.incompatibility}
                  editMode={props.editMode}
                  SetStudyPlane={props.SetStudyPlane}
                  studyPlaneProvvisory={props.studyPlaneProvvisory}
                  SetStudyPlaneProvvisory={props.SetStudyPlaneProvvisory}
                  user={props.user}
                  CalcoloCFU={CalcoloCFU}
                  shownewPlane={props.shownewPlane}
                  SetShowNewPlane={props.SetShowNewPlane}
                  typeofPlane={props.typeofPlane}
                  SetTypeOfPlane={props.SetTypeOfPlane}

                />
              </Col>

              <Col>
                <StudyPlane
                  loggedIn={props.loggedIn}
                  studyPlane={props.studyPlane}
                  CoursesList={props.CoursesList}
                  editMode={props.editMode}
                  SetEditMode={props.SetEditMode}
                  user={props.user}
                  SetStudyPlane={props.SetStudyPlane}
                  studyPlaneProvvisory={props.studyPlaneProvvisory}
                  SetStudyPlaneProvvisory={props.SetStudyPlaneProvvisory}
                  CalcoloCFU={CalcoloCFU}
                  shownewPlane={props.shownewPlane}
                  SetShowNewPlane={props.SetShowNewPlane}
                  typeofPlane={props.typeofPlane}
                  SetTypeOfPlane={props.SetTypeOfPlane}
                  savePlan={props.savePlan}
                  deletePlan={props.deletePlan}

                />
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <>
          <h1 align="center">
            <i>Courses</i>
          </h1>
          <Container fluid>
            <CoursesTable
              CoursesList={props.CoursesList}
              loggedIn={props.loggedIn}
              incompatibility={props.incompatibility}
            />
          </Container>
        </>
      )}
    </>
  );
}

function CoursesTable(props) {
  return (
    <>
      <Table className="m-2" striped hover borderless>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>CFU</th>
            <th>Number Students </th>
            <th>Max Number</th>
          </tr>
        </thead>
        <tbody>
          {props.CoursesList.map((co) => (
            <CourseRow
              Course={co}
              key={co.code}
              loggedIn={props.loggedIn}
              incompatibility={props.incompatibility}
              CoursesList={props.CoursesList}
              editMode={props.editMode}
              SetStudyPlane={props.SetStudyPlane}
              studyPlaneProvvisory={props.studyPlaneProvvisory}
              SetStudyPlaneProvvisory={props.SetStudyPlaneProvvisory}
              user={props.user}
              CalcoloCFU={props.CalcoloCFU}
              shownewPlane={props.shownewPlane}
              SetShowNewPlane={props.SetShowNewPlane}
              typeofPlane={props.typeofPlane}
              SetTypeOfPlane={props.SetTypeOfPlane}

            />
          ))}
        </tbody>
      </Table>
    </>
  );
}

function CourseRow(props) {
  return (
    <>
      <tr>
        <CourseData Course={props.Course} />
        <CourseActions
          loggedIn={props.loggedIn}
          incompatibility={props.incompatibility}
          Course={props.Course}
          CoursesList={props.CoursesList}
          editMode={props.editMode}
          SetStudyPlane={props.SetStudyPlane}
          studyPlaneProvvisory={props.studyPlaneProvvisory}
          SetStudyPlaneProvvisory={props.SetStudyPlaneProvvisory}
          user={props.user}
          CalcoloCFU={props.CalcoloCFU}
          shownewPlane={props.shownewPlane}
          SetShowNewPlane={props.SetShowNewPlane}
          typeofPlane={props.typeofPlane}
          SetTypeOfPlane={props.SetTypeOfPlane}

        />
      </tr>
    </>
  );
}

function CourseData(props) {
  return (
    <>
      <td>{props.Course.code}</td>
      <td>{props.Course.name}</td>
      <td>{props.Course.CFU}</td>
      <td>{props.Course.NumStudents}</td>
      <td>{props.Course.MaxStudents}</td>
    </>
  );
}

function CourseActions(props) {
  return (
    <>
      <td>
        <ButtonInfo
          incompatibility={props.incompatibility}
          Course={props.Course}
          CoursesList={props.CoursesList}
          studyPlaneProvvisory={props.studyPlaneProvvisory}
          shownewPlane={props.shownewPlane}
          editMode={props.editMode}
          CalcoloCFU={props.CalcoloCFU}
          typeofPlane={props.typeofPlane}
        />
      </td>

      <td>
        {props.editMode || props.shownewPlane ? (
          <>
            <Button
              variant="dark"
              disabled={
                checkEsamigiapresentinelpianodiStudi(props.studyPlaneProvvisory, props.Course.code) ||
                checkMaxStudent(props.Course.NumStudents, props.Course.MaxStudents) ||
                checkIncompatibility(props.incompatibility, props.Course.code, props.studyPlaneProvvisory) ||
                checkPropedeuticity(props.studyPlaneProvvisory, props.Course.Propaedeuticity) ||
                checkCFUSuperati(props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory), props.typeofPlane, props.Course.CFU)
              }
              onClick={() => {
                props.SetStudyPlaneProvvisory((sp) => sp.concat({ courseCode: props.Course.code, IDStudent: props.user.IDStudent, }));
                toast.success("Examination added correctly", {
                  position: "top-center",
                  theme: "dark",
                  autoClose: 1000,
                });
              }}>
              <IoAdd size={20} />
            </Button>
          </>
        ) : (
          ""
        )}
      </td>
    </>
  );
}

function ButtonInfo(props) {
  const [open, SetOpen] = useState(false);

  const codeInco = props.incompatibility.filter((i) => i.courseCode === props.Course.code).map((el) => el);
  const codeExam = props.CoursesList.map((it) => it);
  let array = [];
  codeInco.forEach((element) => {
    codeExam.forEach((el) => {
      if (element.incompatibility === el.code) {
        array.push(el);
      }
    });
  });

  return (
    <>
      <Button variant="dark" onClick={() => SetOpen(!open)}>
        <BsInfoLg size={20} />
      </Button>

      <Collapse in={open} dimension="width">
        <div>
          <Card style={{ width: "400px" }}>
            <span>
              {props.editMode || props.shownewPlane ? (
                <>
                  {checkEsamigiapresentinelpianodiStudi(props.studyPlaneProvvisory, props.Course.code) ?
                    (
                      <>
                        <Card>
                          <Card.Header as="h5" className="bg-danger text-white">
                            Reason
                          </Card.Header>
                          <Card.Body>
                            <b>This course is already in your study plan</b>
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  {checkIncompatibility(props.incompatibility, props.Course.code, props.studyPlaneProvvisory) ?
                    (
                      <>
                        <Card>
                          <Card.Header as="h5" className="bg-danger text-white">
                            Reason
                          </Card.Header>
                          <Card.Body>
                            <b>
                              This course is incompatible with a course you have
                              already inserted in your study plan!
                            </b>
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  {checkPropedeuticity(props.studyPlaneProvvisory, props.Course.Propaedeuticity) ?
                    (
                      <>
                        <Card>
                          <Card.Header as="h5" className="bg-danger text-white">
                            Reason
                          </Card.Header>
                          <Card.Body>
                            <b>
                              In your study plan you must first insert the
                              propaedeutic course!
                            </b>
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                  {checkMaxStudent(props.Course.NumStudents, props.Course.MaxStudents) ?
                    (
                      <>
                        <Card>
                          <Card.Header as="h5" className="bg-danger text-white">
                            Reason
                          </Card.Header>
                          <Card.Body>
                            <b>
                              This course has already reached the maximum number
                              of students!
                            </b>
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}

                  {checkCFUSuperati(props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory), props.typeofPlane, props.Course.CFU) ?
                    (
                      <>
                        <Card>
                          <Card.Header as="h5" className="bg-danger text-white">
                            Reason
                          </Card.Header>
                          <Card.Body>
                            <b>
                              This course cannot be added because you will exceed
                              the maximum credit threshold!
                            </b>
                          </Card.Body>
                        </Card>
                      </>
                    ) : (
                      ""
                    )}
                </>
              ) : (
                ""
              )}

              <Card>
                <Card.Header as="h5" className="bg-dark text-white">
                  Propedeuticity
                </Card.Header>
                {props.Course.Propaedeuticity != null ?
                  (
                    <Card.Body>
                      <Card.Title>
                        Code : {props.Course.Propaedeuticity}
                      </Card.Title>
                      {props.CoursesList.filter((item) => item.code === props.Course.Propaedeuticity).map((i) =>
                      (
                        <Card.Text key={i.code}>
                          {" "}
                          <>
                            {" "}
                            Name : {i.name} <br></br> CFU : {i.CFU}{" "}
                          </>{" "}
                        </Card.Text>
                      ))}
                    </Card.Body>
                  ) : (
                    <Card.Body>
                      <Card.Text>There is no propaedeuticity</Card.Text>
                    </Card.Body>
                  )}
              </Card>

              <Card>
                <Card.Header as="h5" className="bg-dark text-white">
                  Incompatibility
                </Card.Header>
                {props.incompatibility.filter((i) => i.courseCode === props.Course.code).length !== 0 ?
                  (
                    <Card.Body>
                      {props.incompatibility.filter((i) => i.courseCode === props.Course.code).map((el) =>
                      (
                        <Card.Title key={el.incompatibility}>
                          {" "}
                          Code : {el.incompatibility}{" "}
                        </Card.Title>
                      ))}
                      {array.map((i) =>
                      (
                        <Card.Text key={i.code}>
                          {" "}
                          <>
                            {" "}
                            Name : {i.name} <br></br> CFU : {i.CFU}{" "}
                          </>{" "}
                        </Card.Text>
                      ))}
                    </Card.Body>
                  ) : (
                    <Card.Body>
                      <Card.Text>There is no incompatibility </Card.Text>
                    </Card.Body>
                  )}
              </Card>
            </span>
          </Card>
        </div>
      </Collapse>
    </>
  );
}

export default Courses;
