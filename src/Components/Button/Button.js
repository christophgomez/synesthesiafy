import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';
import isExternal from 'is-url-external';

class Button extends React.Component {
  render() {
    let el;
    if (this.props.link) {
      if (!isExternal(this.props.link)) {
        el = <Link className='Link' to={this.props.link}
          style=
          {
            {
              "backgroundColor": this.props.backgroundColor,
              "width": this.props.width,
              "borderColor": this.props.borderColor,
              "fontSize": this.props.fontSize,
            }
          }>{this.props.children}</Link>
      } else {
        el = <a className='Link' href={this.props.link} target='_blank' rel="noopener noreferrer"
          style=
          {
            {
              "backgroundColor": this.props.backgroundColor,
              "width": this.props.width,
              "borderColor": this.props.borderColor,
              "fontSize": this.props.fontSize,
            }
          }>{this.props.children}</a>;
      }
    } else {
      el = <button className='Button'
        style=
        {
          {
            "backgroundColor": this.props.backgroundColor,
            "width": this.props.width,
            "borderColor": this.props.borderColor,
            "fontSize": this.props.fontSize,
          }
        }
        onClick={this.props.function}>{this.props.children}</button>
    }
    return el;
  }
}

export default Button;