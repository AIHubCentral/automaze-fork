"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const db_1 = __importDefault(require("../../db"));
const modelService_1 = __importDefault(require("../../Services/modelService"));
const ModelCreation = {
    name: discord_js_1.Events.ThreadCreate,
    once: false,
    async run(client, channel) {
        if (!channel.isThread())
            return;
        if (channel.parentId != client.discordIDs.Forum.VoiceModel)
            return;
        const service = new modelService_1.default(db_1.default);
        const starterMessage = await channel.fetchStarterMessage();
        const description = starterMessage ? starterMessage.content : '';
        await service.create({
            id: channel.id,
            parent_id: channel.parentId ?? '',
            author_id: channel.ownerId ?? '',
            title: channel.name,
            is_request: false,
            description,
        });
    },
};
exports.default = ModelCreation;
/*
async function updateModels(thread) {
    let result;
    let starterMessage = await thread.fetchStarterMessage().catch(err => {
        console.log(`unsuccessfully fetched starter message`)
    })

    if (Extractor.extractDownloadLinks(starterMessage?.content)?.length) {
        let user = starterMessage?.author;

        result = {
            id: modelsFile[modelsFile.length-1].id + 1,
            title: thread.name,
            starterMessage: starterMessage?.content,
            creator: user?.username,
            creatorID: user?.id,
            creationTimestamp: thread.createdTimestamp,
            downloadURL: Extractor.extractDownloadLinks(starterMessage?.content),
            illustrationURL: Extractor.extractAttachmentLinks(starterMessage),
            tags: Extractor.snowflakeToName(thread.appliedTags)
        };
    }
    filename = `${process.cwd()}/JSON/_models.json`;
    rll.read(filename, 2).then(async (lines) => {
        var to_vanquish = lines.length;
        fs.stat(filename, async (err, stats) => {
            if (err) throw err;
            fs.truncateSync(filename, stats.size - to_vanquish, (err) => {
                if (err) throw err;
                console.log('File truncated!');
            })
            fs.appendFileSync(filename, '\t},\n\t'+JSON.stringify(result, null, 4) + '\n]');
        });
    });
}
*/
