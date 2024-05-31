export interface Respuesta {
    fulfillmentMessages: (platform)[];
}

interface platform {
    platform: string;
    text: {
        text: string[];
    };
}
