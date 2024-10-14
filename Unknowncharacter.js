/*
{
   cmdname: "characterfilter",
   type: "security",
}
*/

let bots = false;
const {
  smd,
  bot_,
  send,
  deleteMessage,
  blockContact,
} = require('../lib');

const unsupportedCharsRegex = /[^\x20-\x7E]/; // Matches non-ASCII characters (replace with appropriate regex)

// Register the command to toggle character filtering
smd({
  pattern: "antibug",
  alias: ["characterfilter", "cf"],
  desc: "enable/disable character filtering",
  category: "security",
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
    
    if (!action) {
      return await message.send("*_Character Filter currently *" + (checkinfo.charfilter === "false" ? "Disabled" : "Enabled") + "!_*\n" 
                                + (checkinfo.charfilter === "false" ? '' : "_*Status:* " + (checkinfo.charfilter === 'true' ? 'on' : checkinfo.charfilter) + "_\n") 
                                + "*_Use on/off to toggle Character Filter_*");
    } else {
      if (action === "false") {
        if (checkinfo.charfilter === "false") {
          return await message.reply("*_Character Filter Already Disabled_*");
        }
        await bot_.updateOne({
          'id': 'bot_' + message.user
        }, {
          'charfilter': "false"
        });
        return await message.send("*_Character Filter Successfully Disabled!_*");
      } else {
        if (checkinfo.charfilter === "true") {
          return await message.reply("*_Character Filter already enabled!_*");
        }
        await bot_.updateOne({
          'id': "bot_" + message.user
        }, {
          'charfilter': "true"
        });
        return await message.send("*_Character Filter Successfully Enabled!_*");
      }
    }
  } catch (e) {
    await message.error(`${e}\n\ncommand:charfilter`, e);
  }
});

// Main listener for character filtering
smd({
  on: "main"
}, async (msg) => {
  try {
    if (!msg || msg.reaction || msg.protocol || msg.pollUpdate) {
      return "Not Allowed";
    }
    
    if (!bots) {
      bots = await bot_.findOne({
        id: `bot_${msg.user}`
      });
    }
    
    if (!bots || !bots.charfilter || bots.charfilter === "false") {
      return "CHARACTER FILTER DISABLED";
    }
    
    // Check if the message contains unsupported characters
    let msgText = msg.body; // You may need to access the raw text body
    if (unsupportedCharsRegex.test(msgText)) {
      // Delete the message
      await deleteMessage(msg);
      
      // Block the sender
      await blockContact(msg.user);
      
      // Log the action
      console.log(`Blocked and deleted message from ${msg.user} due to unsupported characters.`);
    }
  } catch (e) {
    console.log("Error in character filter:", e);
  }
});
