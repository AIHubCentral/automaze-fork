module.exports = {
    name: "ready",
    once: true,
    run(client){
        console.log(`\nReady! Logged in as ${client.user.tag}`);

        const guilds = client.guilds.cache;
        console.log(`\nBot is currently in ${guilds.size} guild(s):`);

        guilds.forEach((guild) => {
            console.log(`${guild.id}: ${guild.name}`);
        });
    }
};