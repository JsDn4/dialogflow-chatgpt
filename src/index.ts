/* eslint-disable max-len */

import {onRequest} from "firebase-functions/v2/https";
import {Respuesta} from "./types";
// import {peticionOpenAi} from "./helpers/peticionOpenAi";
import axios from "axios";
// import * as logger from "firebase-functions/logger";

const OPENAI_API_KEY = "sk-proj-8Ve89y4LxqbWEO23UVH4T3BlbkFJtZ7v7OuWADku1AV8Lr4r";

export const app = onRequest( async (req, res) => {
  let result: Respuesta;

  try {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }


    const intent = req.body.queryResult.intent.displayName;
    const query = req.body.queryResult.queryText;


    if (intent === "PreguntasEspecificacionesFin") {
      // Peticion a openai

      // const openaiResponseData = await peticionOpenAi(query);
      // logger.info(`openaiResponseData: ${openaiResponseData}`);

      const openaiResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
        "model": "gpt-3.5-turbo",
        "messages": [
          {"role": "system", "content": "Esta es una conversación sobre electrónica."},
          {"role": "user", "content": query},
        ],
        "max_tokens": 150,
        "temperature": 0.7,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0.6,
        "stop": ".",
      }, {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      const openaiResponseData = openaiResponse.data.choices[0].message.content;

      result = {
        fulfillmentMessages: [
          {
            platform: "Telegram",
            text: {
              text: [openaiResponseData],
            },
          },
          {
            platform: "Telegram",
            text: {
              text: ["Ha sido un gusto poder ayudarte. (✿◠‿◠) ᕗ"],
            },
          },
        ],

      };

      res.status(200).send(result);
    }
  } catch (error) {
    result = {
      fulfillmentMessages: [
        {
          platform: "Telegram",
          text: {
            text: ["Lo siento, La peticion duro mas de 5 segundos."],
          },
        },
      ],
    };

    res.status(500).send(result);
    return;
  }
});
