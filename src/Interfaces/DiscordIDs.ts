interface KeyValue {
    [key: string]: string;
}

interface ITags {
    Free: string;
    Paid: string;
    Taken: string;
    Done: string;
}

interface IRequestModel {
    ID: string;
    Tags: ITags;
    ComissionAllow: string[];
}

interface IForum {
    Suggestions: string;
    VoiceModel: string;
    TaskSTAFF: string;
    Guides: string;
    RequestModel: IRequestModel;
}

export default interface IDiscordIDs {
    Guild: string;
    Channel: KeyValue;
    Forum: IForum;
    Roles: KeyValue;
}
