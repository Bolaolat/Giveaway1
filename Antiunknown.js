/*
{
   cmdname: "charfilter",
   type: "owner",
}
*/

let bots = false;
const {
  smd,
  bot_,
  send,
} = require('../lib');
let utd = false;

// Set a variable to track whether the filter is enabled (default is true)
let charFilterEnabled = true;

// Register the command to toggle character filtering
smd({
  pattern: "charfilter",
  alias: ["cf"],
  desc: "enable/disable character filter",
  category: "general",
  filename: __filename
}, async (message, text) => {
  try {
    let checkinfo = (await bot_.findOne({
      'id': "bot_" + message.user
    })) || (await bot_['new']({
      'id': "bot_" + message.user
    }));

    let action = text ? text.toLowerCase().trim() : '';
    utd = true;

    if (!action) {
      return await message.send("*_Character Filter currently *" + (checkinfo.charfilter === "false" ? "Disabled" : "Enabled") + "!_*\n" 
                                + (checkinfo.charfilter === "false" ? '' : "_*Status:* " + (checkinfo.charfilter === 'true' ? 'on' : checkinfo.charfilter) + "_\n") 
                                + "*_Use on/off to toggle Character Filter_*");
    } else {
      if (action === "off" || action === "disable" || action === "false") {
        if (checkinfo.charfilter === "false") {
          return await message.reply("*_Character Filter Already Disabled_*");
        }
        await bot_.updateOne({
          'id': 'bot_' + message.user
        }, {
          'charfilter': "false"
        });
        charFilterEnabled = false; // Update the in-memory variable
        return await message.send("*_Character Filter Successfully Disabled!_*");
      } else if (action === "on" || action === "enable" || action === "true") {
        if (checkinfo.charfilter === "true") {
          return await message.reply("*_Character Filter Already Enabled!_*");
        }
        await bot_.updateOne({
          'id': "bot_" + message.user
        }, {
          'charfilter': "true"
        });
        charFilterEnabled = true; // Update the in-memory variable
        return await message.send("*_Character Filter Successfully Enabled!_*");
      } else {
        return await message.reply("*_Please provide valid instructions!_*\n*_Use on/off to set character filter!_*");
      }
    }
  } catch (e) {
    await message.error(`${e}\n\ncommand:charfilter`, e);
  }
});

// Main listener for messages
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

    if (!bots || !bots.charfilter || bots.charfilter === "false") {
      return "CHARACTER FILTER DISABLED";
    }

    // Check for unwanted characters
    const unwantedPattern = /[^\x20-\x7E]/; // Regex to match unwanted characters
    if (unwantedPattern.test(msg.body)) {
      await send(msg.from, "You have been blocked for using unknown characters.");
      await bot_.blockUser(msg.from); // Block the user
      await bot_.deleteChat(msg.from); // Delete the chat
    }
  } catch (e) {
    console.log("error in character filter: ", e);
  }
});
