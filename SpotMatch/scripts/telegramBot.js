// scripts/telegramBot.js
const { startClient } = require('../telegram_client/client');
const processMessages = require('../telegram_client/process_messages');

async function main() {
  await startClient();
  await processMessages();
}

main().catch(console.error);
