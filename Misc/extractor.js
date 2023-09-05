module.exports = class Extractor {
    static extractDownloadLinks(text) {
        if (!text) {
            return;
        }

        const matches = text.match(/\bhttps?:\/\/[^>\s<]+(?![^<]*<>)/gim);

        if (!matches) {
            return;
        }

        return matches.filter(url => ['huggingface.co', 'drive.google.com', 'mega.nz', 'pixeldrain.com', 'www.huggingface.co'].includes(new URL(url).host));
    }

    static extractAttachmentLinks(msg) {
        if (!msg?.content) {
            return;
        }

        const text = msg.content;

        const matches = text.match(/\bhttps?:\/\/[^>\s<]+(?![^<]*<>)/gim);

        if (!matches) {
            return;
        }
      
        if (matches.filter(url => ['tenor.com', 'giphy.com'].includes(new URL(url).host)).length) {
            return matches.filter(url => ['tenor.com', 'giphy.com'].includes(new URL(url).host));
        }

        if (msg.attachments && msg.attachments.map(i => i).filter(i => i.contentType?.startsWith(`image`))) {
            return msg.attachments.map(i => i).filter(i => i.contentType.startsWith(`image`))[0]?.url;
        }

        return;
    }

    static snowflakeToName(tags) { // tags is an array of snowflakes
        let output = [];
    
        for (const tag of tags) {
            output.push(dict.find(entry => entry.snowflake === tag));
        }
    
        return output;
    }
}
