const { React } = require('powercord/webpack');
const { SwitchItem, Category } = require('powercord/components/settings');
const KeybindRecorder = require('./KeybindRecorder');

const defaultSetting ={ 
  Next: {ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, key: "ArrowUp"}, 
  Prev: {ctrlKey: true, shiftKey: false, altKey: false, metaKey: false, key: "ArrowDown"} 
}

//This section is the Page the user sees
module.exports = class Settings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { getSetting, updateSetting } = this.props;

    return(
      <div>

        <div style={{color: 'white'}}>
          <b>Note: </b>
          If you are having any issues with key inputs not working please mention me(knei#5537) on the powercord support server <a onClick={()=>{require('electron').shell.openExternal('https://discord.gg/FWj7Uk6jZn')}}>here</a>.
        </div>
        <br/><br/>

        <SwitchItem
          value={getSetting('mention', true)}
          onChange={val => {updateSetting('mention', val)}}
          note="Mention the the user you are replying to"
        >
          Mention on Reply
        </SwitchItem>

        <Category
          name = 'Reply Next Settings'
          opened = {this.state.cat_Next ?? false}
          onChange = {()=>{ this.setState({cat_Next: !this.state.cat_Next}) }}
        >
          <KeybindRecorder
            value = {getSetting('replyNext', defaultSetting.Next).key}
            onChange = {val => {
              this.setState({value: val})
              toggleSetting(this, 'replyNext', 'key', val)}
            }
            onReset = {() => {
              this.setState({value: defaultSetting.Next.key});
              toggleSetting(this, 'replyNext', 'key', defaultSetting.Next.key)}}
          >
            Reply to next key
          </KeybindRecorder>
          <SwitchItem 
            value={getSetting('replyNext', defaultSetting.Next).ctrlKey}
            onChange={val => {toggleSetting(this, 'replyNext', 'ctrlKey', val)}}
            note="If disabled you won't need to press ctrl to reply to the next message"
            >
            Ctrl Key
          </SwitchItem>
          <SwitchItem 
            value={getSetting('replyNext', defaultSetting.Next).shiftKey}
            onChange={val => {toggleSetting(this, 'replyNext', 'shiftKey', val)}}
            note="If disabled you won't need to press shift to reply to the next message"
          >
            Shift Key
          </SwitchItem>
          <SwitchItem 
            value={getSetting('replyNext', defaultSetting.Next).altKey}
            onChange={val => {toggleSetting(this, 'replyNext', 'altKey', val)}}
            note="If disabled you won't need to press alt to reply to the next message"
          >
            Alt Key
          </SwitchItem>
          <SwitchItem 
            value={getSetting('replyNext', defaultSetting.Next).metaKey}
            onChange={val => {toggleSetting(this, 'replyNext', 'metaKey', val)}}
            note="If disabled you won't need to press windows(windows)/command(Macintosh) key to reply to the next message"
          >
            Meta Key
          </SwitchItem>
        </Category>

        <Category
          name = 'Reply Previous Settings'
          opened = {this.state.cat_Prev ?? false}
          onChange = {()=>{ this.setState({cat_Prev: !this.state.cat_Prev}) }}
        >
          <KeybindRecorder
            value = {getSetting('replyPrev', defaultSetting.Prev).key}
            onChange = {val => {
              this.setState({value: val})
              toggleSetting(this, 'replyPrev', 'key', val)}
            }
            onReset = {() => {
              this.setState({value: defaultSetting.Prev.key});
              toggleSetting(this, 'replyPrev', 'key', defaultSetting.Prev.key)}}
          >
            Reply to previous key
          </KeybindRecorder>
          <SwitchItem 
            value={getSetting('replyPrev', defaultSetting.Prev).ctrlKey}
            onChange={val => {toggleSetting(this, 'replyPrev', 'ctrlKey', val)}}
            note="If disabled you won't need to press ctrl to reply to the previous message"
            >
            Ctrl Key
          </SwitchItem>
          <SwitchItem 
            value={getSetting('replyPrev', defaultSetting.Prev).shiftKey}
            onChange={val => {toggleSetting(this, 'replyPrev', 'shiftKey', val)}}
            note="If disabled you won't need to press shift to reply to the previous message"
          >
            Shift Key
          </SwitchItem>
          <SwitchItem 
            value={getSetting('replyPrev', defaultSetting.Prev).altKey}
            onChange={val => {toggleSetting(this, 'replyPrev', 'altKey', val)}}
            note="If disabled you won't need to press alt to reply to the previous message"
          >
            Alt Key
          </SwitchItem>
          <SwitchItem 
            value={getSetting('replyPrev', defaultSetting.Prev).metaKey}
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

function toggleSetting(T, S, p, n) {
  let origin = T.props.getSetting(S, defaultSetting[S.substring(5)])
  origin[p]=n;
  T.props.updateSetting(S, origin)
}

