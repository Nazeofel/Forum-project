import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { NotificationObject } from "./interfaces";
export const jwtoken = atomWithStorage<any>("token", undefined);
export const localFMC = atomWithStorage<any>("FCM", undefined);
export const notifications = atomWithStorage<NotificationObject[]>(
  "notifications",
  []
);
export const menuAtom = atom(false);
export const atomPosts = atom<any[]>([]);
export const dbPosts = atom<any[]>([]);

/* atom post  ! */

// TRYING RTKQ.
