import { PrefixCommand } from "../../Interfaces/Command";

const Java: PrefixCommand = {
    name: 'java',
    category: 'Tags',
    description: 'STOP CALLING JAVASCRIPT "JAVA" HERES THE FUCKING DIFFERENCE',
    aliases: ['js', 'javascript'],
    syntax: `java`,
    async run(client, message) {
        if (message.content !== '-js' && !message.content.includes('script')) {
            await message.react('☕');
        }
        message.channel.send(`# i will not fucking repeat this so listen carefully. Key differences between Java and JavaScript: Java is an OOP programming language while Java Script is an OOP scripting language. Java creates applications that run in a virtual machine or browser while JavaScript code is run on a browser only. Java code needs to be compiled while JavaScript code are all in text. SO STOP CALLING JAVASCRIPT "JAVA" AHSDIAHIDHAOIHFOI\n> **Credits**: FungusDesu`);
    }
}

export default Java;