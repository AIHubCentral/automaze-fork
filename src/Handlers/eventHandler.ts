import path from "node:path";
import ExtendedClient from "../Core/extendedClient";
import IEventData from "../Interfaces/Events";
import { getAllFiles } from "../Utils/fileUtilities";

const EVENTS_PATH = path.join(process.cwd(), 'dist', 'Events');

export default function registerEvents(client: ExtendedClient) {
	const eventFiles = getAllFiles(EVENTS_PATH);

	for (const file of eventFiles) {
		const eventData: IEventData = require(file).default || require(file);

		if (eventData.once) {
			client.once(eventData.name, (...args) => eventData.run(client, ...args));
		}
		else {
			client.on(eventData.name, (...args) => eventData.run(client, ...args));
		}
	}
}