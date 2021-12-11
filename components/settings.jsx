const { React } = require('powercord/webpack');
const { TextInput, SwitchItem, Category } = require('powercord/components/settings');

const defaultSetting ={ 
  Next: {ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, code: "ArrowUp"}, 
  Prev: {ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, code: "ArrowDown"} 
}
let validation = {Next: true, Prev: true};

//This section is the Page the user sees
module.exports = class Settings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return(
      <div>

        <div style={{color: 'white'}}>
          <b>Note: </b>
          If you are having any issues with key inputs not working please check <a onClick = { ( ) => { require('electron').shell.openExternal('https://github.com/notKnei/quickChatReply/wiki/keyBindsHelp') } }>here</a>.
        </div>
        <br/><br/>

        <Category
          name = 'Reply Next Settings'
          opened = {this.state.cat_Next}
          onChange = {()=>{ this.setState({cat_Next: !this.state.cat_Next}) }}
        >
          <TextInput
            defaultValue={this.props.getSetting('replyNext', defaultSetting.Next).code}
            onChange={val => {validateInput(this, 'replyNext', 'code', val)}}
            required={true}
            note='Changes the key for replying to the next message'
            style={validation.Next ? {} : { borderColor: "#e53935" }}
            >
            Reply to Next Key Id
          </TextInput>
          <SwitchItem 
            value={this.props.getSetting('replyNext', defaultSetting.Next).ctrlKey}
            onChange={val => {toggleSetting(this, 'replyNext', 'ctrlKey', val)}}
            note="If disabled you won't need to press ctrl to reply to the next message"
            >
            Ctrl Key
          </SwitchItem>
          <SwitchItem 
            value={this.props.getSetting('replyNext', defaultSetting.Next).shiftKey}
            onChange={val => {toggleSetting(this, 'replyNext', 'shiftKey', val)}}
            note="If disabled you won't need to press shift to reply to the next message"
          >
            Shift Key
          </SwitchItem>
          <SwitchItem 
            value={this.props.getSetting('replyNext', defaultSetting.Next).altKey}
            onChange={val => {toggleSetting(this, 'replyNext', 'altKey', val)}}
            note="If disabled you won't need to press alt to reply to the next message"
          >
            Alt Key
          </SwitchItem>
          <SwitchItem 
            value={this.props.getSetting('replyNext', defaultSetting.Next).metaKey}
            onChange={val => {toggleSetting(this, 'replyNext', 'metaKey', val)}}
            note="If disabled you won't need to press windows(windows)/command(Macintosh) key to reply to the next message"
          >
            Meta Key
          </SwitchItem>
        </Category>

        <Category
          name = 'Reply Previous Settings'
          opened = {this.state.cat_Prev}
          onChange = {()=>{ this.setState({cat_Prev: !this.state.cat_Prev}) }}
        >
          <TextInput
            defaultValue={this.props.getSetting('replyPrev', defaultSetting.Prev).code}
            onChange={val => {validateInput(this, 'replyNext', 'code', val)}}
            required={true}
            note='Changes the key for replying to the next message'
            style={validation.Prev? {} : { borderColor: "#e53935" }}
            >
            Reply to Next Key Id
          </TextInput>
          <SwitchItem 
            value={this.props.getSetting('replyPrev', defaultSetting.Prev).ctrlKey}
            onChange={val => {toggleSetting(this, 'replyPrev', 'ctrlKey', val)}}
            note="If disabled you won't need to press ctrl to reply to the next message"
            >
            Ctrl Key
          </SwitchItem>
          <SwitchItem 
            value={this.props.getSetting('replyPrev', defaultSetting.Prev).shiftKey}
            onChange={val => {toggleSetting(this, 'replyPrev', 'shiftKey', val)}}
            note="If disabled you won't need to press shift to reply to the next message"
          >
            Shift Key
          </SwitchItem>
          <SwitchItem 
            value={this.props.getSetting('replyPrev', defaultSetting.Prev).altKey}
            onChange={val => {toggleSetting(this, 'replyPrev', 'altKey', val)}}
            note="If disabled you won't need to press alt to reply to the next message"
          >
            Alt Key
          </SwitchItem>
          <SwitchItem 
            value={this.props.getSetting('replyPrev', defaultSetting.Prev).metaKey}
            onChange={val => {toggleSetting(this, 'replyPrev', 'metaKey', val)}}
            note="If disabled you won't need to press windows(windows)/command(Macintosh) key to reply to the next message"
          >
            Meta Key
          </SwitchItem>
        </Category>

      </div>
    )
  }
}

function toggleSetting( T, S, p, n ) {
  validation[S.substring(5)] = true;
  let origin = T.props.getSetting( S, defaultSetting[S.substring(5)] )
  origin[p] = n
  T.props.updateSetting(S, origin)
}

function validateInput( T, S, p, n ) {
  if ( /(Key[A-Z]|(Numpad|Digit)[0-9]|ArrowUp|ArrowDown|ArrowLeft|ArrowRight)/.test(n) ) return toggleSetting( T, S, p, n );
  else validation[S.substring(5)] = false; 
}
