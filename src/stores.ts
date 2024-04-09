import { writable } from "svelte/store";
import type { CardProps } from "./types";

export const selectedCard = writable<CardProps | null>(null);
