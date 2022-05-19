/* jshint esversion: 6 */

const { React } = require('powercord/webpack');
const { Divider } = require('powercord/components');
const {
  TextInput,
  TextAreaInput,
  SwitchItem
} = require('powercord/components/settings');

module.exports = ({ getSetting, updateSetting, toggleSetting }) => (
  <div>
    <TextInput
      note='Set prefix. Requires reload to apply changes.'
      defaultValue={getSetting('prefix', '')}
      required={false}
      onChange={(val) => updateSetting('prefix', val)}
    >
      Prefix
    </TextInput>
    <TextInput
      note='Set suffix. Requires reload to apply changes.'
      defaultValue={getSetting('suffix', '')}
      required={false}
      onChange={(val) => updateSetting('suffix', val)}
    >
      Suffix
    </TextInput>
    <Divider />
    <SwitchItem
      value={getSetting('whitelistMode')}
      onChange={() => toggleSetting('whitelistMode')}
    >
      Use whitelist instead of blacklist
    </SwitchItem>
    <TextAreaInput
      note='Snowflakes blacklist, seperate them by a comma (,). Can be a user, group, channel or guild.'
      value={getSetting('exclude', '')}
      disabled={getSetting('whitelistMode', false)}
      required={false}
      onChange={(val) => updateSetting('exclude', val)}
    >
      Blacklisted IDs
    </TextAreaInput>
    <TextAreaInput
      note='Snowflakes whitelist, seperate them by a comma (,). Can be a user, group, channel or guild.'
      value={getSetting('include', '')}
      disabled={!getSetting('whitelistMode', false)}
      required={false}
      onChange={(val) => updateSetting('include', val)}
    >
      Whitelisted IDs
    </TextAreaInput>
  </div>
);
