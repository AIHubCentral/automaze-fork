const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require("discord.js");
const fs = require(`fs`);
const ms = require('pretty-ms');
const dict = require('../../Configs/Forum/dictionaryTags.json');
const Extractor = require('../../Misc/extractor.js');

module.exports = {
    category: 'Utilities',
    type: 'slash',

    data: new SlashCommandBuilder()
        .setName('fetchmodels')
        .setDescription('find a voice model')
        .addStringOption(option => option
            .setName('channel')
            .setDescription('id of voice models channel to scrape')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads),

    async execute(client, interaction) {
        client.channels.fetch(interaction.options.getString('channel'))
            .then(channel => {
                if(channel.type == ChannelType.GuildForum)
                    fetchmodels(client, interaction);
                else
                    interaction.reply('Not a forum')
            })
            .catch(() => {
                console.error
                interaction.reply('Not a channel')
            });
    },
};

async function fetchmodels(client,interaction) {
    modelsAdded = 0;
    const startTimestamp = Date.now();

    const fetchingEmbed = new EmbedBuilder()
        .setTitle(`♻ Enumerating...`)
        .setDescription(`Enumerating through <#${interaction.options.getString('channel')}>`)
        .setColor(`Purple`);

    let msg = await interaction.reply({embeds: [fetchingEmbed]})
    const forum = client.channels.cache.get(interaction.options.getString('channel'));
    const forumThreadsActive = await forum.threads.fetchActive(true);
    let forumThreadsArchived = await forum.threads.fetchArchived({limit: 100});

    while (forumThreadsArchived.hasMore) {
        const lastThread = forumThreadsArchived.threads.last();
        const additionalThreads = await forum.threads.fetchArchived({before: lastThread, limit: 100});
        forumThreadsArchived.threads = forumThreadsArchived.threads.concat(additionalThreads.threads)
        forumThreadsArchived.hasMore = additionalThreads.hasMore
    }

    const filteredActive = forumThreadsActive.threads.filter(c => c.parentId == interaction.options.getString('channel'))
    const filteredArchived = forumThreadsArchived.threads.filter(c => c.parentId == interaction.options.getString('channel'))

    const fetchTime = Date.now() - startTimestamp;

    const loadingEmbed = new EmbedBuilder()
        .setTitle(`⏳ Loading... (no skipping svc because ily :3)`)
        .setDescription(`## Processed ${0}/${filteredActive.size + filteredArchived.size} threads\n- ${0} threads successfully saved\n- ${0} threads skipped\n- ${0} threads failed\n- Time elapsed: ${ms(Date.now() - startTimestamp, {verbose: true})}\n- Current fetching speed: 0 threads/s\n- Estimated time left: ∞ centuries`)
        .setColor(`Yellow`)
        .setFooter({text: `Fetching ${filteredActive.size + filteredArchived.size} threads, ${filteredActive} of which are currently unarchived.`});
    
    let loopProps = {
        total: filteredActive.size + filteredArchived.size,
        msg: msg,
        result: [],
        iteration: 0,
        totalProcessed: 0,
        unintended: 0,
        errored: 0,
        fetchTimestamp: Date.now(),
        startTimestamp: startTimestamp,
        loadingEmbed: loadingEmbed
    }

    try {
        await fetchBase(loopProps, filteredActive)
            .then(response => fetchBase(response, filteredArchived))
            .then(response => loopProps = response)
        const successEmbed = new EmbedBuilder()
            .setTitle(`✔ Success!`)
            .setDescription(`- All threads are fetched and saved to local JSON file!\n- ${loopProps.totalProcessed} threads have been processed, in which ${loopProps.iteration} threads successfully fetched, ${loopProps.unintended} skipped and ${loopProps.errored} errored out.\n- Fetching threads took ${ms(fetchTime, {verbose: true})}.\n- The process took a total of ${ms(Date.now() - startTimestamp, {verbose: true})}.`)
            .setColor(`Green`);

        msg.edit({embeds: [successEmbed]});
    } catch (err) {
        console.error(err)
        msg.edit({embeds: [failedEmbed.setDescription(`The process ran into an unexpected error!\n\`\`\`\n${err.toString()}\n\`\`\`\nA total of ${loopProps.iteration} processed threads are saved.`)]})
    } finally {
        fs.writeFileSync(`./JSON/result.json`, JSON.stringify(loopProps.result, null, 2))
        interaction.user.send({content: `Fetching completed. Output:`, files: [`./JSON/result.json`]})
    }
}

async function fetchBase(props, array) {
    const a = []
    for (const i of array) {
        a.push(i)
    }
    
    await Promise.all(a.map(async (i)=>{
        if ((props.totalProcessed) % 50 === 0 && props.totalProcessed !== 0) {
            props.msg.edit({embeds: [props.loadingEmbed.setDescription(`## Processed ${props.totalProcessed}/${props.total} threads\n- ${props.iteration} threads successfully saved\n- ${props.unintended} threads skipped\n- ${props.errored} threads failed\n- Time elapsed: ${ms(Date.now() - props.startTimestamp, {verbose: true})}\n- Current fetching speed: ${(props.totalProcessed / ((Date.now() - props.fetchTimestamp) / 1000)).toFixed(3)} threads/s\n- Estimated time left: ${(Math.round(props.totalProcessed / ((Date.now() - props.fetchTimestamp) / 1000))) * 1000 !== 0 ? ms(Math.round((props.total - props.totalProcessed) / (Math.round(props.totalProcessed / ((Date.now() - props.fetchTimestamp) / 1000))) * 1000), {verbose: true}) : `∞ centuries`}`)]})
        }
        
        const result = await fetchLoop(i);
        if(result) {
            props.result.push(result);
            props.iteration++;
        }
        else {
            console.log(`Unable to find any links in thread named ${i[1].name}, moving to next thread...`);
            props.errored++;
        }
        props.totalProcessed++;
    }));

    return props
}

async function fetchLoop(i) {
    let result;
    let starterMessage = await i[1].fetchStarterMessage().catch(err => {
        console.log(`unsuccessfully fetched starter message at iteration ${props.iteration + 1}: ${err.toString()}`);
        return;
    })

    if (Extractor.extractDownloadLinks(starterMessage?.content)?.length) {
        let user = starterMessage?.author;
        
        result = {
            id: i[1].id,
            title: i[1].name,
            starterMessage: starterMessage?.content,
            creator: user?.username,
            creatorID: user?.id,
            creationTimestamp: i[1].createdTimestamp,
            downloadURL: Extractor.extractDownloadLinks(starterMessage?.content),
            illustrationURL: Extractor.extractAttachmentLinks(starterMessage),
            tags: Extractor.snowflakeToName(i[1].appliedTags)
        };
    } else {
        const fetchedMsgs = await i[1].messages.fetch({limit: 10});

        for (const fetchedMsg of fetchedMsgs.filter(mes => mes.author.id === i[1].ownerId)) {
            if (Extractor.extractDownloadLinks(fetchedMsg[1].content)?.length) {
                let owner = await i[1].fetchOwner().catch(err => {
                    console.log(`unsuccessfully fetched owner at iteration ${props.iteration + 1}: ${err.toString()}`)
                })
                let user = starterMessage?.author;

                result = {
                    id: i[1].id,
                    title: i[1].name,
                    starterMessage: starterMessage?.content,
                    creator: user?.username,
                    creatorID: user?.id,
                    creationTimestamp: i[1].createdTimestamp,
                    downloadURL: Extractor.extractDownloadLinks(fetchedMsg[1]?.content),
                    illustrationURL: Extractor.extractAttachmentLinks(fetchedMsg[1]),
                    tags: Extractor.snowflakeToName(i[1].appliedTags)
                };
            }
        }
    }
    return result
}

const failedEmbed = new EmbedBuilder()
    .setTitle(`❌ Error`)
    .setColor(`Red`);