import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
export const jwtoken = atomWithStorage<any>("token", undefined);
export const logged = atomWithStorage("logged", false);
export const errors = atom<any>({});
export const menuAtom = atom(false);
export const atomPosts = atom<any[]>([]);
