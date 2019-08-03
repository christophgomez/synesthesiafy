import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';

class NavBar extends React.Component {
  render() {
    return (
      <div className='Nav'>
        <Navbar collapseOnSelect bg='dark' variant='dark' expand='sm' fixed='top'>
          <Container fluid>
            <Navbar.Brand href="#home">Synesthesiafy</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
              <Nav>
                <LinkContainer to='/dashboard'><Nav.Link active>Home</Nav.Link></LinkContainer>
                <LinkContainer to='/about'><Nav.Link active>About</Nav.Link></LinkContainer>
                <Nav.Link href="https://github.com/christophgomez" target="_blank" active={false}>Github <FontAwesomeIcon icon={faGithub} /></Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(NavBar);