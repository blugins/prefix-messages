const { Plugin } = require('powercord/entities');
const Settings = require("./Settings");
const { inject, uninject } = require("powercord/injector");
const { getModule, getModuleByDisplayName, React } = require('powercord/webpack');
const getSettings = require("./getSettings");


module.exports = class PrefSuf extends Plugin {
  startPlugin() {
    let prefix = this.settings.get('prefix', '')
    let suffix = this.settings.get('suffix', '')
    // set the config if none is set
    if (!window.localStorage.getItem("excluded-server"))
      window.localStorage.setItem("excluded-server", "[]");
    if (!window.localStorage.getItem("excluded-channel"))
      window.localStorage.setItem("excluded-channel", "[]");
    
    this.loadStylesheet("style.scss");

    powercord.api.settings.registerSettings("prefix", {
      category: this.entityID,
      label: "Prefix",
      render: Settings
    });
    
    setImmediate(async () => {
      const messageEvents = await getModule(["sendMessage"], true);
      if (!messageEvents)
        throw new ReferenceError("Failed to load message events");
      
      inject("prefix-injection", messageEvents, "sendMessage", function (args) {
        const { getChannel } = getModule(["getChannel"], false);
        const modMessage = prefix + args[1].content + suffix
        const channel = getChannel(args[0]);
        const { exludedChannel, exludedServer } = getSettings();
        const excludedChannel = exludedChannel.map(e => e.split(/(\d+)/)[1]);
        const excludedServer = exludedServer.map(s => s.split(/(\d+)/)[1]);
        const isUserChannel = channel.type === 1;

        if (excludedChannel.includes(channel.id) || excludedServer.includes(channel.guild_id))
          return args;
        // block emote from dm
        for (const exclChannel of excludedChannel) {
          if (channel.recipients.includes(exclChannel))
            return args;
        }

        for (const server of excludedServer) {
          if (channel.recipients.includes(server))
            return args;
        }
        args[1].content = modMessage;
        return args;
      });
    });

  }

  pluginWillUnload() {
    powercord.api.settings.unregisterSettings("Prefix");
    powercord.api.settings.unregisterCommand("Prefix");
    uninject("prefix-injection");
  }
};
