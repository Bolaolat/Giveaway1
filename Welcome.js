/*
{
   cmdname: "autowelcome",
   type: "general",
}
*/

let bots = false;
const {
  smd,
  bot_,
  send,
} = require('../lib');
let utd = false;

// Define greetings to listen for
const greetings = ["hey", "hi", "haffa", "sup"];

// Define the automatic reply
const replyText = "whatup";

// Register the command to toggle autowelcome
smd({
  pattern: "awelcome",
  alias: ["autowelcome", "aw"],
  desc: "enable/disable auto welcome response",
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
    let action = textt.startsWith('on') || textt.startsWith('enable') || textt.startsWith('true') ? "true" : 
                 textt.startsWith('off') || textt.startsWith('disable') ? 'false' : '';
    utd = true;

    if (!action) {
      return await message.send("*_Auto Welcome currently *" + (checkinfo.autowelcome === "false" ? "Disabled" : "Enabled") + "!_*\n" 
                                + (checkinfo.autowelcome === "false" ? '' : "_*Status:* " + (checkinfo.autowelcome === 'true' ? 'on' : checkinfo.autowelcome) + "_\n") 
                                + "*_Use on/off to toggle Auto Welcome_*");
    } else {
      if (action === "false") {
        if (checkinfo.autowelcome === "false") {
          return await message.reply("*_Auto Welcome Already Disabled_*");
        }
        await bot_.updateOne({
          'id': 'bot_' + message.user
        }, {
          'autowelcome': "false"
        });
        return await message.send("*_Auto Welcome Successfully Disabled!_*");
      } else {
        if (checkinfo.autowelcome === "true") {
          return await message.reply("*_Auto Welcome already enabled!_*");
        }
        await bot_.updateOne({
          'id': "bot_" + message.user
        }, {
          'autowelcome': "true"
        });
        return await message.send("*_Auto Welcome Successfully Enabled!_*");
      }
    }
  } catch (e) {
    await message.error(`${e}\n\ncommand:awelcome`, e);
  }
});

// Main listener for greetings
smd({
  on: "main"
}, async (msg) => {
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
    
    if (!bots || !bots.autowelcome || bots.autowelcome === "false") {
      return "AUTO WELCOME DISABLED";
    }
    
    // Check if the message contains any greeting
    let msgText = msg.body.toLowerCase().trim();
    if (greetings.some(greeting => msgText.includes(greeting))) {
      await send(msg, replyText);
    }
  } catch (e) {
    console.log("error in auto welcome: ", e);
  }
});
