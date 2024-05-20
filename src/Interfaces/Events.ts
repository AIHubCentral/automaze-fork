import ExtendedClient from "../Core/extendedClient";

export default interface IEventData {
    name: string;
    once: boolean;
    run: (client: ExtendedClient, ...args: any[]) => Promise<void>;
}