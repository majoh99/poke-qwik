import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: import.meta.env.PUBLIC_OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

export const getFunFactAboutPokemon = async( pokemonName: string ):Promise<string> => {

  delete configuration.baseOptions.headers['User-Agent'];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages:[
      {
        "content": `Escribe datos interesantes del pokemon ${ pokemonName }`,
        "role": "user"
      },
    ],
    temperature: 0.7,
    max_tokens: 60,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  console.log('entro');
  

  console.log({response});
  

  return response.data.choices[0].message?.content || '';

};
