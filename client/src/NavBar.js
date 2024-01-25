import { Navbar, Container, Button } from 'react-bootstrap';
import { AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai'
import { GiNotebook } from 'react-icons/gi'
import { BsFillPersonFill } from 'react-icons/bs'
import { useNavigate } from 'react-router';

function NavBar(props) {
    const navigate = useNavigate();

    return (
        <>

            <Navbar bg="dark" variant="dark" className='p-1'>
                <Container fluid>
                    <Navbar.Brand>
                        <GiNotebook size={40} />
                        {' '}
                        <i>Study Plane</i>
                    </Navbar.Brand>

                    <Navbar.Brand>
                        {props.loggedIn ?
                            <span> <BsFillPersonFill size={32} /> <i>{props.user.Name}</i> </span>
                            :
                            " "}
                    </Navbar.Brand>

                    <Navbar.Brand>
                        <Button className=' rounded-pill' variant='dark' >
                            {props.loggedIn ?
                                <AiOutlineLogout size={40} onClick={props.logout} />
                                :
                                <AiOutlineLogin size={40} onClick={() => navigate('login')} />}
                            {' '}
                        </Button>
                        {props.loggedIn ?
                            <i>Logout</i>
                            :
                            <i>Login</i>}

                    </Navbar.Brand>


                </Container>
            </Navbar>

        </>
    )
}

export default NavBar;