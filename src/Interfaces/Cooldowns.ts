import { Collection } from "discord.js";

export default interface ICooldowns {
    [key: string]: Collection<string, any>;
}