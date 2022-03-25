/**
 * Thank you to the following for the code:
 * @TheShadowGamer
 * Soursed from: https://github.com/TheShadowGamer/Disconnect-From-Voice/blob/main/components/Settings.jsx
 */

const { React } = require('powercord/webpack');
const FormItem = require('powercord/components/settings/FormItem');

const renameKeys = Object.freeze({
  ' ': 'Space',
  Control: 'Ctrl',
  AltGraph: 'AltGr',
  ArrowUp: 'Up',
  ArrowDown: 'Down',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  AudioVolumeUp: 'VolumeUp',
  AudioVolumeDown: 'VolumeDown',
  AudioVolumeMute: 'VolumeMute'
});

module.exports = class TextInput extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      id: `pc-kbr-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      recording: false,
      value: this.props.value,
      listeners: null
    };

    this.forceUpdate = false;
  }

  componentDidUpdate (prevProps) {
    if (this.props.value !== prevProps.value || this.forceUpdate) {
      this.forceUpdate = false;
      this.setState({ value: this.props.value });
    }
  }

  render () {
    const { Button } = require('powercord/components/')
    // @todo: Make sure this component is still usable
    const className = this.state.recording ? 'powercord-keybind recording pc-container' : 'powercord-keybind pc-container pc-hasValue';
    return (
      <FormItem title={this.props.children} note={this.props.note} required={this.props.required}>
        <div className='powercord-keybind-container'>
          <div className={className} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            this.setRecording(!this.state.recording);
          }}>
            <div className='powercord-keybind-inner pc-layout pc-flex'>
              <input
                className='powercord-keybind-input pc-input pc-base'
                value={this.state.value}
                id={this.state.id}
              />
              <div className='powercord-keybind-btn pc-flex'>
                <button type='button' className='powercord-keybind-button pc-button pc-grow'>
                  <div className='powercord-keybind-button-inner pc-contents'>
                    <span className='text pc-text'>{this.state.recording ? 'Stop Recording' : 'Edit Keybind'}</span>
                    <span className='icon pc-icon' />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <Button onClick={() => this.props.onReset()}>Reset keybind</Button>
        </div>
      </FormItem>
    );
  }

  componentWillUnmount () {
    this.setRecording(false);
  }

  setRecording (recording) {
    const element = document.getElementById(this.state.id);
    if (recording && !this.state.recording) {
      const inputListener = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.repeat) {
          return;
        }

        const key = e.key[0].toUpperCase() + e.key.slice(1);

        if ((this.state.value.match(/\+\+?/g) || []).length !== 1) {
          this.setState({ value: this.state.value === '' ? key : `${this.state.value}+${key}` });
        }

        if ((`${this.state.value}+${key}`.match(/\+\+?/g) || []).length === 1) {
          element.blur();
          this.setRecording(false);
        }
      };

      const clickListener = () => {
        this.setRecording(false);
      };

      element.focus();
      element.addEventListener('keydown', inputListener);
      window.addEventListener('click', clickListener);

      if (this.props.onRecord) {
        this.props.onRecord();
      }

      this.setState({
        recording: true,
        value: '',
        listeners: {
          input: inputListener,
          window: clickListener
        }
      });
    } else if (!recording && this.state.recording) {
      element.removeEventListener('keydown', this.state.listeners.input);
      window.removeEventListener('click', this.state.listeners.window);

      this.forceUpdate = true;
      if (this.state.value === '') {
        this.props.onReset();
      } else {
        this.props.onChange(this.state.value);
      }

      this.setState({
        recording: false,
        listeners: null
      });
    }
  }
};