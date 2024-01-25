import { Button, Table, Alert, Modal, Container } from "react-bootstrap";
import { MdAutoDelete } from "react-icons/md";
import { BiEdit, BiExit, BiSave } from "react-icons/bi";
import { BsFillTrash2Fill } from "react-icons/bs";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function checkPropedeuticity(spp, Course, codsppRow) {
  let proped = Course.filter((el) => spp.map((element) => element.courseCode)
    .includes(el.code) && el.code !== codsppRow)
    .map((i) => i.Propaedeuticity);
  if (proped.includes(codsppRow)) return false;
  else return true;
}

function StudyPlane(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //------------per il modal del pulsante NewPlane
  const [showmodeNewPlane, setShowmodeNewPlane] = useState(false);
  const handleClosPlane = () => setShowmodeNewPlane(false);
  const handleShowPlane = () => setShowmodeNewPlane(true);
  //------------per il modal del pulsante exit dal new plane
  const [exitNewPlane, setExitNewPlane] = useState(false);
  const handlecloseexitNewPlane = () => setExitNewPlane(false);
  const handleshowexitNewPlane = () => setExitNewPlane(true);

  //---------salvataggio---------//
  const handleSave = (event) => {
    event.preventDefault();
    let cfu = props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory);
    if (props.typeofPlane === 1) {
      if (cfu < 60) {
        toast.warning(` You have not reached the minimum number of credits required, you are still missing ${60 - cfu} CFU `,
          {
            position: "top-center",
            theme: "dark",
            autoClose: 2000,
          }
        );
      } else if (cfu > 80) {
        toast.warning(` You have exceeded the maximum number of CFUs `,
          {
            position: "top-center",
            theme: "dark",
            autoClose: 2000,
          });
      } else {
        const codeCourses = props.studyPlaneProvvisory.map((el) => el.courseCode);
        const ptft = props.typeofPlane;
        const study = { codeCourses: codeCourses, ptft: ptft };
        props.savePlan(study);
      }
    } else {
      if (cfu < 20) {
        toast.warning(
          `  You have not reached the minimum number of credits required, you are still missing ${20 - cfu
          } CFU `,
          {
            position: "top-center",
            theme: "dark",
            autoClose: 2000,
          }
        );
      } else if (cfu > 40) {
        toast.warning(` You have exceeded the maximum number of CFU `, {
          position: "top-center",
          theme: "dark",
          autoClose: 2000,
        });
      } else {
        const codeCourses = props.studyPlaneProvvisory.map((el) => el.courseCode);
        const ptft = props.typeofPlane;
        console.log(ptft)
        const study = { codeCourses: codeCourses, ptft: ptft };
        props.savePlan(study);
      }
    }
  };

  return (
    <>
      {props.studyPlane.length !== 0 ? (
        <>
          <h1 align="center">
            <i>Study Plan</i>
          </h1>
          {props.typeofPlane === 1 ? (
            <h3 align="center">Full Time</h3>
          ) : (
            <h3 align="center">Part Time</h3>
          )}
          <ToastContainer></ToastContainer>
          <Table className="m-2" hover borderless>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>CFU</th>
              </tr>
            </thead>
            <tbody>
              {props.editMode ? (
                <>
                  {props.studyPlaneProvvisory.map((sp) => (
                    <StudyPlaneRow
                      key={sp.courseCode}
                      plane={sp}
                      CoursesList={props.CoursesList}
                      editMode={props.editMode}
                      SetEditMode={props.SetEditMode}
                      studyPlaneProvvisory={props.studyPlaneProvvisory}
                      SetStudyPlaneProvvisory={props.SetStudyPlaneProvvisory}
                      typeofPlane={props.typeofPlane}
                      SetTypeOfPlane={props.SetTypeOfPlane}

                    />
                  ))}
                </>
              ) : (
                <>
                  {props.studyPlane.map((sp) => (
                    <StudyPlaneRow
                      key={sp.courseCode}
                      plane={sp}
                      CoursesList={props.CoursesList}
                      editMode={props.editMode}
                      SetEditMode={props.SetEditMode}
                      typeofPlane={props.typeofPlane}
                      SetTypeOfPlane={props.SetTypeOfPlane}
                    />
                  ))}
                </>
              )}
              <tr>
                <td></td>
                <td></td>
                {props.typeofPlane === 1 ? (
                  <>
                    {props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory) <= 80 && props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory) >= 60 ?
                      (
                        <td className="text-success">
                          {props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}
                        </td>
                      ) : (
                        <td className="text-danger">
                          {props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}
                        </td>
                      )}
                  </>
                ) : (
                  <>
                    {props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory) <= 40 && props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory) >= 20 ?
                      (
                        <td className="text-success">
                          {props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}
                        </td>
                      ) : (
                        <td className="text-danger">
                          {props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}
                        </td>
                      )}
                  </>
                )}
              </tr>
            </tbody>
          </Table>

          {props.editMode ? (
            <>
              <Button onClick={() => { handleShow(); }} variant="secondary">
                <BiExit size={40}></BiExit>
                <b>Exit Edit Mode</b>
              </Button>

              <Button variant="secondary" onClick={handleSave}>
                <BiSave size={40}></BiSave>
                <b>Save</b>
              </Button>

              <Button variant="dark" onClick={() => { props.deletePlan(); }} >
                <BsFillTrash2Fill size={40}></BsFillTrash2Fill>
                <b>Delete Permanent</b>
              </Button>

              {props.typeofPlane === 1 ? (
                <>
                  <Container fluid>
                    <Alert variant="dark">
                      <Alert.Heading> Beware ! </Alert.Heading>
                      <p>
                        If you are a Full-time student, you can enter{" "}
                        <b>Min : 60 CFU</b>
                        <b>Max : 80 CFU</b>
                      </p>
                      <p>
                        <b>
                          You can still enter :
                          <p>
                            Min :{" "}
                            {60 - props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}{" "}
                            CFU
                            <p>
                              Max :{" "}
                              {80 - props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}{" "}
                              CFU
                            </p>
                          </p>
                        </b>
                      </p>
                    </Alert>
                  </Container>
                </>
              ) : (
                <>
                  <Container fluid>
                    <Alert variant="dark">
                      <Alert.Heading>Beware ! </Alert.Heading>
                      <p>
                        If you are a Part-time student, you can enter{" "}
                        <b>Min: 20 CFU</b> Max: <b>Max: 40 CFU</b>
                      </p>
                      <p>
                        <b>
                          You can still enter :
                          <p>
                            Min :{" "}
                            {20 - props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}{" "}
                            CFU
                            <p>
                              Max :{" "}
                              {40 - props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}{" "}
                              CFU
                            </p>
                          </p>
                        </b>
                      </p>
                    </Alert>
                  </Container>
                </>
              )}
            </>
          ) : (
            <BiEdit size={40} onClick={() => props.SetEditMode(true)} />
          )}

          <Modal show={show} onHide={handleClose}>
            <Modal.Header>
              <Modal.Title> Beware !</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You are leaving without saving, do you want to continue?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => {
                handleClose();
                props.SetEditMode(false);
                props.SetShowNewPlane(false);
                props.SetStudyPlaneProvvisory(props.studyPlane);
              }}
              >
                Yes
              </Button>
              <Button variant="dark" onClick={handleClose}>
                No
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        /*new study plane*/
        <>
          <h1 align="center">
            <i>Study Plan</i>
          </h1>
          {props.shownewPlane ? (
            <>
              {props.typeofPlane === 1 ? (
                <h3 align="center">Full Time</h3>
              ) : (
                <h3 align="center">Part Time</h3>
              )}
              <Table className="m-2" hover borderless>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>CFU</th>
                  </tr>
                </thead>
                <tbody>
                  {props.studyPlaneProvvisory.map((sp) => (
                    <StudyPlaneRow
                      key={sp.courseCode}
                      plane={sp}
                      CoursesList={props.CoursesList}
                      editMode={props.editMode}
                      SetEditMode={props.SetEditMode}
                      studyPlaneProvvisory={props.studyPlaneProvvisory}
                      SetStudyPlaneProvvisory={props.SetStudyPlaneProvvisory}
                      shownewPlane={props.shownewPlane}
                      SetShowNewPlane={props.SetShowNewPlane}

                    />
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    {props.typeofPlane === 1 ? (
                      <>
                        {props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory) <= 80 && props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory) >= 60 ?
                          (
                            <td className="text-success">
                              {props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}
                            </td>
                          ) : (
                            <td className="text-danger">
                              {props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}
                            </td>
                          )}
                      </>
                    ) : (
                      <>
                        {props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory) <= 40 && props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory) >= 20 ?
                          (
                            <td className="text-success">
                              {props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}
                            </td>
                          ) : (
                            <td className="text-danger">
                              {props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}
                            </td>
                          )}
                      </>
                    )}
                  </tr>
                </tbody>
              </Table>
            </>
          ) : (
            ""
          )}

          {props.shownewPlane ? (
            <>
              <Modal show={showmodeNewPlane} onHide={handleClosPlane}>
                <Modal.Header>
                  <Modal.Title>Select mode </Modal.Title>
                </Modal.Header>
                <Modal.Body>Choose between these two modes</Modal.Body>
                <Modal.Footer>
                  <Button variant="dark" onClick={() => {
                    handleClosPlane();
                    props.SetTypeOfPlane(1);
                  }} >
                    FullTime
                  </Button>
                  <Button variant="secondary" style={{ marginRight: "30%" }} onClick={() => {
                    handleClosPlane();
                    props.SetTypeOfPlane(0);
                  }}>
                    PartTime
                  </Button>
                </Modal.Footer>
              </Modal>

              <Button onClick={handleshowexitNewPlane} variant="secondary">
                <BiExit size={40}></BiExit>
                <b>Exit</b>
              </Button>

              <Button variant="secondary" onClick={handleSave}>
                <BiSave size={40}></BiSave>
                <b>Save</b>
              </Button>

              {props.typeofPlane === 1 ? (
                <>
                  <Container fluid>
                    <Alert variant="dark">
                      <Alert.Heading>Beware ! </Alert.Heading>
                      <p>
                        If you are a Full-time student, you can enter{" "}
                        <b>Min: 60 CFU</b> Max: <b>Max: 80 CFU</b>
                      </p>
                      <p>
                        <b>
                          You can still enter :
                          <p>
                            Min :{" "} {60 - props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}{" "}CFU
                            <p>
                              Max :{" "} {80 - props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}{" "} CFU
                            </p>
                          </p>
                        </b>
                      </p>
                    </Alert>
                  </Container>
                </>
              ) : (
                <>
                  <Container fluid>
                    <Alert variant="dark">
                      <Alert.Heading>Beware ! </Alert.Heading>
                      <p>
                        If you are a Part-time student, you can enter{" "}
                        <b>Min: 20 CFU</b> Max: <b>Max: 40 CFU</b>
                      </p>
                      <p>
                        <b>
                          You can still enter :
                          <p>
                            Min :{" "}{20 - props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}{" "} CFU
                            <p>
                              Max :{" "}{40 - props.CalcoloCFU(props.CoursesList, props.studyPlaneProvvisory)}{" "} CFU
                            </p>
                          </p>
                        </b>
                      </p>
                    </Alert>
                  </Container>
                </>
              )}
            </>
          ) : (
            <>
              <Container>
                <Button style={{ marginLeft: "45%" }} variant="dark" onClick={() => {
                  props.SetShowNewPlane(true);
                  handleShowPlane();
                }} >
                  New Plane{" "}
                </Button>

                <Alert variant="dark" align="center">
                  <Alert.Heading>Beware ! </Alert.Heading>
                  <p>
                    You have not yet created a study plan, if you want to create
                    one click on <b>New Plane</b>.
                  </p>
                </Alert>
              </Container>
            </>
          )}

          <Modal show={exitNewPlane} onHide={handlecloseexitNewPlane}>
            <Modal.Header closeButton>
              <Modal.Title> Beware !</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You are leaving without saving, do you want to continue?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => {
                handlecloseexitNewPlane();
                props.SetShowNewPlane(false);
                props.SetEditMode(false);
                props.SetStudyPlaneProvvisory(props.studyPlane);
              }}
              >
                Yes
              </Button>
              <Button variant="dark" onClick={handlecloseexitNewPlane}>
                No
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

function StudyPlaneRow(props) {
  return (
    <tr>
      <StudyPlaneData plane={props.plane} CoursesList={props.CoursesList} />
      <StudyPlaneAction
        editMode={props.editMode}
        CoursesList={props.CoursesList}
        studyPlaneProvvisory={props.studyPlaneProvvisory}
        SetStudyPlaneProvvisory={props.SetStudyPlaneProvvisory}
        plane={props.plane}
        shownewPlane={props.shownewPlane}
        SetShowNewPlane={props.SetShowNewPlane}

      />
    </tr>
  );
}

function StudyPlaneData(props) {
  return (
    <>
      {props.CoursesList.filter((item) => item.code === props.plane.courseCode).map((el) =>
      (
        <>
          <td>{el.code}</td>
          <td>{el.name}</td>
          <td>{el.CFU}</td>
          <td></td>
        </>
      ))}
    </>
  );
}

function StudyPlaneAction(props) {
  return (
    <>
      {props.editMode || props.shownewPlane ? (
        <td>
          <MdAutoDelete type="button" size={20} onClick={() => {
            if (checkPropedeuticity(props.studyPlaneProvvisory, props.CoursesList, props.plane.courseCode)) {

              props.SetStudyPlaneProvvisory((sp) => sp.filter((sp) => sp.courseCode !== props.plane.courseCode));
              toast.success("Successful cancellation",
                {
                  position: "top-center",
                  theme: "dark",
                  autoClose: 1000,
                });
            } else {
              toast.warning(`This exam is propaedeutic you cannot cancel it`,
                { position: "top-center", theme: "dark", autoClose: 2000 }
              );
            }
          }}
          />
        </td>
      ) : (
        ""
      )}
    </>
  );
}

export default StudyPlane;
