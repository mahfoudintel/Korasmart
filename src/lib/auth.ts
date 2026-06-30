export const authEmailDomain = "korasmart.local";
export const isAuthRequired = process.env.NEXT_PUBLIC_REQUIRE_AUTH === "true";

export const usernameToSlug = (username: string) =>
  username
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");

export const usernameToEmail = (username: string) => `${usernameToSlug(username)}@${authEmailDomain}`;
