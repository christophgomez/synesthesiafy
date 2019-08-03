import React from 'react';
import './Dashnav.css';

export class DashnavItem extends React.Component {
  render() {
    return (
      <li className='dashnav-item'>{this.props.children}</li>
    );
  }
}

export class Dashnav extends React.Component {
  render() {
    return (
      <nav>
        <ul className='dashnav'>
          {this.props.children}
        </ul>
      </nav>
    );
  }
}