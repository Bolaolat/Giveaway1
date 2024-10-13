smd({
  pattern: "listonline",
  alias: ["lonline", "online"],
  desc: "List members currently online in the group chat",
  category: "general",
  filename: __filename
}, async (message) => {
  try {
    // Check if the command is used in a group chat
    if (!message.isGroup) {
      return await message.reply("*_This command can only be used in group chats._*");
    }

    // Fetch group members and filter those who are online
    let groupMembers = await message.getGroupMembers();
    let onlineMembers = groupMembers.filter(member => member.isOnline);

    // Format the list of online members
    if (onlineMembers.length === 0) {
      return await message.send("*_No members are currently online._*");
    }

    let onlineList = onlineMembers.map(member => member.name || member.id).join('\n');
    await message.send(`*_Members Currently Online:_*\n${onlineList}`);
  } catch (e) {
    await message.error(`${e}\n\ncommand:listonline`, e);
  }
});
