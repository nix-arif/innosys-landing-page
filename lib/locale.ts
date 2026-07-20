import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./content";

export const LOCALE_COOKIE_NAME = "locale";

/** Reads the visitor's chosen language from the `locale` cookie (server-side only). */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
