import { Configuration, OpenAIApi } from 'openai-edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

console.log(process.env.OPENAI_API_KEY);

const openai = new OpenAIApi(config)

export async function generateImagePrompt(name: string) {
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 0.888,
            max_tokens: 50,
            frequency_penalty: 0,
            presence_penalty: 0,
            top_p: 1,
            messages: [
                {
                    role: 'system',
                    content: 'You are a create and helpful AI assistant capable of generating interesting thumbnal descriptions for my notes, Your output will be fed into the DALLE API to generate the thumbnail. The description should be minimalistic and flat styled',
                },
                {
                    role: "user",
                    content: `Please generate a thumbnail description for my notebook title: ${name}`
                }
            ]
        })

        const result = await response.json()
        
        // Debug logs
        console.log('Full response:', result)
        console.log('Choices:', result.choices)
        
        if (!result.choices || !result.choices.length) {
            throw new Error('No choices returned from OpenAI')
        }

        return result.choices[0].message.content;

    } catch (error) {
        console.log('Error details:', error);
        throw error;
    }
}

export async function generateImage(prompt:string){
    try {
        const response = await openai.createImage({
            prompt,
            n:1,
            size:'256x256'
        })
        const data = await response.json();
        const image_url = data.data[0].url;

        return image_url as string;
    } catch (error) {
        console.error(error);
    }
}