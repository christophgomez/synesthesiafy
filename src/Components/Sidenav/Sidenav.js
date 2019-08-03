import React from 'react';
import './Sidenav.css';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components';
import Nav from 'react-bootstrap/Nav';

export class SidenavListItem extends React.Component {
  render() {
    return (
      <li className="sidenav__list-item"><LinkContainer to={this.props.to}><Nav.Link>{this.props.children}</Nav.Link></LinkContainer></li>
    );
  }
}

export class SidenavList extends React.Component {
  render() {
    return (
      <ul className="sidenav__list">
        {this.props.children}
      </ul>
    );
  }
}

export class Sidenav extends React.Component {
  state = {
    color: this.props.color
  };
  componentDidUpdate(prevProps) {
    if(prevProps.color !== this.props.color) {
      this.setState({ color: this.props.color });
    }
  }
  render() {
    const SideNav = styled.div`
      background-color: ${this.state.color};
    `
    return (
      <div className="sidenav">
        <h1 className='sidenav__header'>{this.props.title}</h1>
        {this.props.children}
      </div>
    )
  }
}