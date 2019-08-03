import React from 'react';
import './ColorPreferences.css';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-regular-svg-icons';
import { SketchPicker as TwitterPicker } from 'react-color'
import reactCSS from 'reactcss';

export default class ColorSettings extends React.Component {
  constructor(props) {
    super(props);
    let color = this.getColor();
    let mode = this.getModeVariant();
    this.state = {
      displayColorPicker: false,
      color: color,
      major: mode.major,
      minor: mode.minor,
      majorPreview: null,
      minorPreview: null,
      majorPlaying: false,
      minorPlaying: false,
    };

  }

  componentDidMount() {
    this.getPreviews();
  }

  async getPreviews() {
    let majorPreview = await this.props.preview(this.convertKeyToNum(this.props.pianoKey), 0);
    let minorPreview = await this.props.preview(this.convertKeyToNum(this.props.pianoKey), 1);
    this.setState({ majorPreview: majorPreview, minorPreview: minorPreview });
  }

  convertKeyToNum(key) {
    switch (key) {
      case 'C':
        return 0;
      case 'C# Db':
        return 1;
      case 'D':
        return 2;
      case 'D# Eb':
        return 3;
      case 'E':
        return 4;
      case 'F':
        return 5;
      case 'F# Gb':
        return 6;
      case 'G':
        return 7;
      case 'G# Ab':
        return 8;
      case 'A':
        return 9;
      case 'A# Bb':
        return 10;
      case 'B':
        return 11;
      default:
        break;
    }
  }

  getColor = () => {
    let colorSettings = localStorage.getItem('colorSettings');
    colorSettings = colorSettings ? JSON.parse(colorSettings) : false;
    let key = this.props.pianoKey;
    let colorExists = colorSettings[`${key}`] ? true : false;
    let color;
    if (colorExists) {
      color = colorSettings[`${key}`]['color'];
    } else {
      color = '#fff';
    }
    return color;
  };

  getModeVariant = () => {
    let colorSettings = localStorage.getItem('colorSettings');
    colorSettings = colorSettings ? JSON.parse(colorSettings) : false;
    let key = this.props.pianoKey;
    let colorExists = colorSettings[key] ? true : false;
    let mode = {};
    if (colorExists) {
      mode.major = colorSettings[key]['major'];
      mode.minor = colorSettings[key]['minor'];
    } else {
      mode.major = 'Normal';
      mode.minor = 'Normal';
    }
    return mode;
  }

  handleClick = () => {
    this.props.toggleControls();
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
    this.props.toggleControls();
  };

  handleChange = (color) => {
    let colorSettings = localStorage.getItem('colorSettings');
    colorSettings = colorSettings ? JSON.parse(colorSettings) : {};
    let key = colorSettings[this.props.pianoKey] ? colorSettings[this.props.pianoKey] : {};
    key['color'] = color.hex;
    colorSettings[this.props.pianoKey] = key;
    localStorage.setItem('colorSettings', JSON.stringify(colorSettings));
    this.setState({ color: color.hex });
  };

  handleModeSelect = (mode, variant) => {
    let colorSettings = localStorage.getItem('colorSettings');
    colorSettings = colorSettings ? JSON.parse(colorSettings) : {};
    let key = colorSettings[this.props.pianoKey] ? colorSettings[this.props.pianoKey] : {};
    key[mode] = variant;
    colorSettings[this.props.pianoKey] = key;
    localStorage.setItem('colorSettings', JSON.stringify(colorSettings));
    if (mode === 'major')
      this.setState({ major: variant });
    else
      this.setState({ minor: variant });
  }

  componentDidUpdate(prevProps) {
    if (this.props.pianoKey !== prevProps.pianoKey) {
      if (this.audio) {
        this.audio.pause();
      }
      let color = this.getColor();
      let mode = this.getModeVariant();
      this.setState({ color: color, major: mode.major, minor: mode.minor, majorPreview: null, minorPreview: null, majorPlaying: false, minorPlaying: false });
      this.getPreviews();
    }
  };

  playPreview(url, mode) {
    if (this.state.majorPlaying || this.state.minorPlaying) {
      this.audio.pause();
      this.setState({ majorPlaying: false, minorPlaying: false });
    }

    this.audio = new Audio(url);
    this.audio.addEventListener("ended", () => {
      this.setState({ majorPlaying: false, minorPlaying: false });
    });
    this.audio.play();
    if (mode === "major") {
      this.setState({ majorPlaying: true });
    } else {
      this.setState({ minorPlaying: true });
    }
  }

  pausePreview(mode) {
    this.audio.pause();
    if (mode === "major") {
      this.setState({ majorPlaying: false });
    } else {
      this.setState({ minorPlaying: false });
    }
  }

  render() {
    const styles = reactCSS({
      'default': {
        popover: {
          position: 'absolute',
          zIndex: '99',
          margin: '0 auto',
          background: '#343a3e !important'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
          height: '100vh !important',
          width: '100vw !important',
        },
        container: {
          width: '50%',
          minHeight: '100%',
          margin: '2em auto',
          textAlign: 'left',
          background: 'inherit'
        },
        content: {
          display: 'flex',
          flexDirection: 'row',
          flexFlow: 'row',
          textAlign: 'left !important',
          width: '100%'
        },
        modeContent: {
          display: 'flex',
          flexDirection: 'row',
          flexFlow: 'row',
          textAlign: 'left !important',
          width: '100%',
          marginBottom: '4em',
        },
        span: {
          width: '1em !important'
        },
        colorButton: {
          margin: '0',
          padding: '0',
          width: '2em',
          height: '2em',
          border: 'none',
          borderRadius: '50%',
          background: `${this.state.color}`,
        },
      },
    });

    return (
      <div style={styles.container}>
        <h4>Key: {this.props.pianoKey}</h4>

        <div style={styles.content}>
          <h5 style={{ margin: '.25em 0' }}>Color: </h5><span style={{ marginRight: '1em' }}></span>
          <button style={styles.colorButton} onClick={() => this.handleClick()}></button>
          {this.state.displayColorPicker ? <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <TwitterPicker style={{ zIndex: '100 !important' }} color={this.state.color} onChange={this.handleChange} />
          </div> : null}
        </div>

        <div style={{ width: '100%' }}>
          <br />
          <h4>Modality</h4>
          <div style={styles.modeContent}>
            <div style={{ width: '50%' }}>
              <h5>Major</h5>
              <div style={styles.content}>
                <div style={{ width: '50%' }}>
                  {!this.state.majorPlaying ?
                    <Button disabled={this.state.majorPreview ? false : true} onClick={() => this.playPreview(this.state.majorPreview, 'major')}>
                      <FontAwesomeIcon size="3x" icon={faPlayCircle} />
                    </Button> :
                    <Button onClick={() => this.pausePreview('major')}>
                      <FontAwesomeIcon size="3x" icon={faPauseCircle} />
                    </Button>
                  }
                </div>
              </div>
              
              <div className='dropdown' onMouseEnter={() => this.props.toggleControls()} onMouseLeave={() => this.props.toggleControls()}>
                <Button>
                  Color Effect <FontAwesomeIcon icon={faCaretDown} />
                </Button>
                <div className="dropdown-content">
                  <ul>
                    <li onClick={() => this.handleModeSelect('major', 'Lighter')}>Lighter {this.state.major === 'Lighter' ? <FontAwesomeIcon icon={faCheck} /> : null}</li>
                    <li onClick={() => this.handleModeSelect('major', 'Normal')}>Normal {this.state.major === 'Normal' ? <FontAwesomeIcon icon={faCheck} /> : null}</li>
                    <li onClick={() => this.handleModeSelect('major', 'Darker')}>Darker {this.state.major === 'Darker' ? <FontAwesomeIcon icon={faCheck} /> : null}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={{}}>
              <h5>Minor</h5>
              <div style={styles.content}>
                <div style={{ width: '50%' }}>
                  {!this.state.minorPlaying ?
                    <Button disabled={this.state.minorPreview ? false : true} onClick={() => this.playPreview(this.state.minorPreview, 'minor')}>
                      <FontAwesomeIcon size="3x" icon={faPlayCircle} />
                    </Button> :
                    <Button onClick={() => this.pausePreview('minor')}>
                      <FontAwesomeIcon size="3x" icon={faPauseCircle} />
                    </Button>
                  }
                </div>
              </div>
              <div className='dropdown' onMouseEnter={() => this.props.toggleControls()} onMouseLeave={() => this.props.toggleControls()}>
                <Button>
                  Color Effect <FontAwesomeIcon icon={faCaretDown} />
                </Button>
                <div className="dropdown-content">
                  <ul>
                    <li onClick={() => this.handleModeSelect('minor', 'Lighter')}>Lighter {this.state.minor === 'Lighter' ? <FontAwesomeIcon icon={faCheck} /> : null}</li>
                    <li onClick={() => this.handleModeSelect('minor', 'Normal')}>Normal {this.state.minor === 'Normal' ? <FontAwesomeIcon icon={faCheck} /> : null}</li>
                    <li onClick={() => this.handleModeSelect('minor', 'Darker')}>Darker {this.state.minor === 'Darker' ? <FontAwesomeIcon icon={faCheck} /> : null}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}