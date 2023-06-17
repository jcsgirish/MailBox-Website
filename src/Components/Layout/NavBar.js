import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';


const Navigationbar = () => {
    return (
        <Navbar bg="light" variant="light">
            <Container>
                <Navbar.Brand exact to="/">MAil BoX</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} exact to="/">Home</Nav.Link>
                    <Nav.Link as={Link} exact to="/inbox">Inbox</Nav.Link>
                    <Nav.Link as={Link} exact to="/composemail">Send Mail</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Navigationbar