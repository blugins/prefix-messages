/* eslint-disable array-bracket-spacing */
/* eslint-disable space-before-function-paren */
/* jshint esversion: 8 */
const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');

const Settings = require('./components/Settings');

module.exports = class PrefSuf extends Plugin {
  async startPlugin() {
    const prefix = this.settings.get('prefix', '');
    const suffix = this.settings.get('suffix', '');
    const exclude = this.settings
      .get('exclude', '')
      .split(',')
      .filter(Boolean)
      .map((e) => e.split(' ').join(''));
    const include = this.settings
      .get('include', '')
      .split(',')
      .filter(Boolean)
      .map((e) => e.split(' ').join(''));

    const messageMdl = await getModule(['sendMessage'], true);

    powercord.api.settings.registerSettings('prefix', {
      category: this.entityID,
      label: 'Prefix',
      render: Settings
    });

    inject('prefix-injection', messageMdl, 'sendMessage', (args) => {
      const { getDMFromUserId, getChannel } = getModule(
        ['getDMFromUserId', 'getChannel'],
        false
      );

      const channel = getChannel(args[0]);
      if (this.settings.get('whitelistMode', false)) {
        if (
          include.includes(channel.id) ||
          include.includes(channel.guild_id) ||
          include.map((e) => getDMFromUserId(e)).includes(channel.id)
        ) {
          args[1].content = prefix + args[1].content + suffix;
          return args;
        }
      } else if (
        !(
          exclude.includes(channel.id) ||
          exclude.includes(channel.guild_id) ||
          exclude.map((e) => getDMFromUserId(e)).includes(channel.id)
        )
      ) {
        args[1].content = prefix + args[1].content + suffix;
      }
      return args;
    });
  }

  pluginWillUnload() {
    powercord.api.settings.unregisterSettings(this.entityID);
    uninject('prefix-injection');
  }
};
