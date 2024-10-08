"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ModelCreation = {
    name: discord_js_1.Events.ThreadCreate,
    once: false,
    async run(client, thread) {
        const { botConfigs, discordIDs } = client;
        if (botConfigs.logs.models && thread.parentId == discordIDs.Forum.VoiceModel) {
            const logData = {
                more: {
                    threadName: thread.name,
                    ownerId: thread.ownerId,
                    createdAt: '',
                    appliedTags: thread.appliedTags,
                    link: `https://discordapp.com/channels/${thread.guild.id}/${thread.parentId}/${thread.id}`,
                },
            };
            if (thread.createdTimestamp) {
                logData.more.createdAt = new Date(thread.createdTimestamp).toISOString();
            }
            client.logger.info('New model added', logData);
        }
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
