import React from 'react';
import './Modal.css';
import { Modal as BootModal } from 'react-bootstrap';

export default class Modal extends React.Component {
  render() {
    return (
      <BootModal
        show={this.props.show}
        onHide={this.props.onHide}
        aria-labelledby="create-playlist-modal"
      >
        <BootModal.Body className='modal-content'>
          <h2>{this.props.title}</h2>
          {this.props.children}
        </BootModal.Body>
      </BootModal>
    );
  }
}