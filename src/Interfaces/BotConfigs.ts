// for boolean true or false settings
interface IConfigToggle {
    [key: string]: boolean;
}

interface CountryColors {
    [key: string]: string[];
}

export interface IConfigColors {
    theme: any;
    country: CountryColors;
}

// allows to set a different prefix for bot commands on the dev server
interface IPrefix {
    dev: string;
    prod: string;
}

// guild to send logs
interface IDebugGuild {
    id: string;
    channelId: string;
}

export default interface IBotConfigs {
    commissions: IConfigToggle;
    general: IConfigToggle;
    trackModels: boolean;
    colors: IConfigColors;
    devServerId: string;
    debugChannelId: string;
    messageOnStartup: boolean;
    prefix: IPrefix;
    logs: IConfigToggle;
    debugGuild: IDebugGuild;
    sendLogs: true;
}