import React from 'react';
import './Footer.css';

class Footer extends React.Component {
  render() {
    return (
      <div className='Foot'>
        {this.props.text}
      </div>
    )
  }
}

export default Footer;