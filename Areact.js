const emojis = ['🍆', '🍆', '🍆', '🍆', '🍆', '🍆', '🍆', '🍆']

/*
{
   cmdname: "autoreaction",
   type: "owner",
}
*/

let bots = false;
const {
  smd,
  botpic,
  send,
  Config,
  tlang,
  sleep,
  smdBuffer,
  prefix,
  bot_,
  react
} = require('../lib');
let utd = false;
//---------------------------------------------------------------------------

smd({
  pattern: "areact",
  alias: ["autoreaction", "autoreact"],
  desc: "enable/disable auto reaction",
  category: "general",
  filename: __filename
}, async (message, text) => {
  try {
    let checkinfo = (await bot_.findOne({
      'id': "bot_" + message.user
    })) || (await bot_['new']({
      'id': "bot_" + message.user
    }));
    let textt = text ? text.toLowerCase().trim() : '';
    let action = textt.startsWith('on') || textt.startsWith('act') || textt.startsWith("enable") || textt.startsWith('true') ? "true" : textt.startsWith("cmd") || textt.startsWith("command") ? 'cmd' : textt.startsWith("all") ? "all" : textt.startsWith('off') || textt.startsWith("reset") || textt.startsWith("deact") || textt.startsWith("disable") ? 'false' : '';
    utd = true;
    if (!action) {
      return await message.send("*_Auto_Reaction currently *" + (checkinfo.autoreaction === "false" ? "Disabled" : "Enabled") + "!_*\n" + (checkinfo.autoreaction === "false" ? '' : "_*Status:* " + (checkinfo.autoreaction === 'true' ? 'on' : checkinfo.autoreaction) + "_\n") + "*_Use on/cmd/all/off to Auto_Reaction_*");
    } else {
      if (action === "false") {
        if (checkinfo.autoreaction === "false") {
          return await message.reply("*_Auto_Reaction Already Disabled_*");
        }
        await bot_.updateOne({
          'id': 'bot_' + message.user
        }, {
          'autoreaction': "false"
        });
        return await message.send("*_Auto_Reaction Succesfully Disable!_*");
      } else {
        if (action === 'cmd' || action === "all" || action === "true") {
          if (checkinfo.autoreaction === action) {
            return await message.reply("*_Auto_Reaction already enabled!_*");
          }
          await bot_.updateOne({
            'id': "bot_" + message.user
          }, {
            'autoreaction': action
          });
          return await message.send("*_Auto_Reaction succesfully enabled!_*");
        } else {
          return await message.reply("*_Please provide valid instructions!_*\n*_Use true/all/cmd/off to set autoreaction!_*");
        }
      }
    }
  } catch (e) {
    await message.error(`${e}\n\ncommand:areact`, e);
  }
});
smd({
  on: "main"
}, async (msg, text, {
  icmd
}) => {
  try {
    if (!msg || msg.reaction || msg.protocol || msg.pollUpdate) {
      return "Not Allowed";
    }
    if (!bots || utd) {
      bots = await bot_.findOne({
        id: `bot_${msg.user}`
      });
      utd = false;
    }
    if (!bots || !bots.autoreaction || bots.autoreaction === "false") {
      return "AUTO REACTION DISABLED";
    }
    if (bots.autoreaction === 'group' && !msg.isGroup || bots.autoreaction === 'pm' && msg.isGroup) {
      return "pm/group not found for auto reaction";
    } else if (bots.autoreaction === 'true' || bots.autoreaction === 'group' || bots.autoreaction === 'pm' || icmd && bots.autoreaction === 'cmd') {
      let emokis = emojis[Math.floor(Math.random() * emojis.length)];
      await react(msg, emokis);
    } else if (bots.autoreaction === 'all') {
      var mokis = mojis[Math.floor(Math.random() * mojis.length)];
      await react(msg, mokis);
    }
  } catch (e) {
    console.log("error in auto reatcion : ", e);
  }
});
