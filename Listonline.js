smd({
  pattern: "listonline",
  alias: ["lonline", "online"],
  desc: "Lists members currently online in the group chat",
  category: "general",
  filename: __filename
}, async (message) => {
  try {
    // Check if command is used in a group chat
    if (!message.isGroup) {
      return await message.reply("*_This command can only be used in group chats._*");
    }

    // Fetch group members and filter those who are online
    let groupMembers = await message.getGroupMembers();
    let onlineMembers = groupMembers.filter(member => member.isOnline);

    // Respond with the list of online members
    if (onlineMembers.length === 0) {
      return await message.send("*_No members are currently online._*");
    } else {
      let onlineList = onlineMembers.map(member => member.name || member.id).join('\n');
      return await message.send(`*_Members Currently Online:_*\n${onlineList}`);
    }
  } catch (e) {
    await message.error(`${e}\n\ncommand:listonline`, e);
  }
});

smd({
  on: "main"
}, async (msg) => {
  try {
    // Only process if the message is in a group chat and command is "listonline"
    if (!msg.isGroup || msg.command !== "listonline") {
      return "Not Allowed";
    }

    // Fetch group members
    let groupMembers = await msg.getGroupMembers();
    let onlineMembers = groupMembers.filter(member => member.isOnline);

    // Check if there are online members and respond accordingly
    if (onlineMembers.length > 0) {
      let onlineList = onlineMembers.map(member => member.name || member.id).join('\n');
      await msg.send(`*_Members Currently Online:_*\n${onlineList}`);
    } else {
      await msg.send("*_No members are currently online._*");
    }
  } catch (e) {
    console.log("Error in listonline command:", e);
  }
});
