export async function createInviteLink(chatId: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('Telegram bot token is not configured');
  // No expire_date means Telegram does not set a time-based expiry. member_limit=1
  // makes the invite link usable for one successful join only.
  const payload = { chat_id: chatId, name: `Jarvis Batches ${new Date().toISOString().slice(0,16)}`, member_limit: 1 };
  const response = await fetch(`https://api.telegram.org/bot${token}/createChatInviteLink`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload), cache: 'no-store' });
  const result = await response.json();
  if (!response.ok || !result.ok || !result.result?.invite_link) throw new Error(`Telegram invite link creation failed: ${result.description || response.status}`);
  return { inviteLink: result.result.invite_link as string };
}
