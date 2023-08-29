module.exports = {
    name: "ready",
    once: true,
    run(client){
        console.log(`\nReady! Logged in as ${client.user.tag}`);
    }
};