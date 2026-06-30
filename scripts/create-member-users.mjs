import { mkdir, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const authEmailDomain = "korasmart.local";

const members = [
  "Najib",
  "Ahmed A",
  "Ahmed G",
  "Nawfal",
  "Badr",
  "Said",
  "Driss",
  "Abdou",
  "Bobker",
  "Abdelhamid",
  "Ismail",
  "Mehdi",
  "Elhachmi",
  "Miloudi",
  "Yassine",
  "Hicham"
];

const slugify = (name) =>
  name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");

const generatePassword = () => {
  const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  const bytes = randomBytes(16);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
};

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const credentials = [];

for (const name of members) {
  const username = slugify(name);
  const email = `${username}@${authEmailDomain}`;
  const password = generatePassword();

  const { data: existingPlayers, error: playerError } = await supabase
    .from("players")
    .select("id, auth_user_id")
    .eq("name", name)
    .limit(1);

  if (playerError) throw playerError;
  const player = existingPlayers?.[0];
  if (!player) {
    console.warn(`Skipping ${name}: player row was not found.`);
    continue;
  }

  let authUserId = player.auth_user_id;

  if (!authUserId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        username
      }
    });

    if (error && !error.message.toLowerCase().includes("already")) throw error;
    authUserId = data.user?.id;
  }

  if (!authUserId) {
    console.warn(`Skipping ${name}: auth user could not be created or found.`);
    continue;
  }

  const { error: updateError } = await supabase
    .from("players")
    .update({
      auth_user_id: authUserId,
      username,
      must_change_password: true
    })
    .eq("id", player.id);

  if (updateError) throw updateError;

  credentials.push({ name, username, password });
}

await mkdir(".generated", { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputPath = `.generated/member-credentials-${stamp}.csv`;
const csv = [
  "name,username,password",
  ...credentials.map((item) => `${item.name},${item.username},${item.password}`)
].join("\n");

await writeFile(outputPath, `${csv}\n`, "utf8");

console.log(`Created or linked ${credentials.length} member accounts.`);
console.log(`Temporary credentials written to ${outputPath}`);
console.log("Send each member only their own username and password, then delete the file after sharing.");
