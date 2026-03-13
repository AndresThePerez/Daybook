import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
    return (
        <Navbar bg="white" expand="lg" className="py-3">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand className="me-auto fw-bold">
                        Note Application
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <LinkContainer to="/">
                            <Nav.Link>Notes</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/categories">
                            <Nav.Link>Categories</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/history">
                            <Nav.Link>History</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
