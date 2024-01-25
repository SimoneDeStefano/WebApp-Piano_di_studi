import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

function LoginForm(props) {
  const [username, setUsername] = useState("Leon.Cino");
  const [password, setPassword] = useState("test");

  const handleSubmit = (event) => {
    event.preventDefault();

    const credentials = { username, password };

    if (username === "") {
      toast.warning(`Campo UserName vuoto`, {
        position: "top-center",
        theme: "dark",
        autoClose: 2000,
      });
      return;
    } else if (password === "") {
      toast.warning(`Campo password vuoto`, {
        position: "top-center",
        theme: "dark",
        autoClose: 2000,
      });
      return;
    }

    props.login(credentials);
  };

  return (
    <>
      <ToastContainer></ToastContainer>
      <Container>
        <Row>
          <Col>
            <h2>Login</h2>
            <Form>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="Username"
                  value={username}
                  onChange={(ev) => setUsername(ev.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                />
              </Form.Group>
              <Button onClick={handleSubmit} variant="dark">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export { LoginForm };
