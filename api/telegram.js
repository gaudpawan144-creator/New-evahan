import fs from "fs";
import path from "path";

const MEMBERS_FILE = path.join(process.cwd(), "members.json");
const TELEGRAM_BOT_TOKEN = "8428236039:AAF3NnPb45eiYIsE4cSgQqyHPuKyirxtt3g";
const OWNER_CHAT_ID = "6426997934";

function loadMembers() {
  try {
    const data = fs.readFileSync(MEMBERS_FILE, "utf8");
    return JSON.parse(data).members || [];
  } catch {
    return [];
  }
}

function saveMembers(members) {
  fs.writeFileSync(MEMBERS_FILE, JSON.stringify({ members }, null, 2));
}

export default async function handler(req, res) {
  const { action, chat_id, message } = req.body;

  if (action === "add_member") {
    if (chat_id !== OWNER_CHAT_ID) {
      return res.status(403).json({ error: "Not authorized" });
    }
    const members = loadMembers();
    if (!members.includes(message)) {
      members.push(message);
      saveMembers(members);
    }
    return res.status(200).json({ ok: true, members });
  }

  if (action === "remove_member") {
    if (chat_id !== OWNER_CHAT_ID) {
      return res.status(403).json({ error: "Not authorized" });
    }
    let members = loadMembers();
    members = members.filter(m => m !== message);
    saveMembers(members);
    return res.status(200).json({ ok: true, members });
  }

  if (action === "book") {
    const members = loadMembers();
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    for (let user_id of members) {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: user_id,
          text: message,
          parse_mode: "Markdown"
        })
      });
    }
    return res.status(200).json({ ok: true });
  }

  res.status(400).json({ error: "Invalid action" });
}
