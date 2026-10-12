const { GoogleGenAI, Type } = require('@google/genai')

const processMessage = async ({
    chatType,
    message,
    context,
    projectContext
}) => {

    const client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    })

    const jsonSchema = {
        type: Type.OBJECT,
        properties: {
            reply: { type: Type.STRING },
            context: { type: Type.STRING },
            title: { type: Type.STRING },
            projectContext: { type: Type.STRING }
        },
        required: ['reply', 'context']
    }

    const prompt = `
        You are a helpful assistant. You will be provided with a message, context, and projectContext. 
        Your task is to generate a response based on the provided information keep your reply for that particular query in the reply and generate the context based on the previous context and current messageif there is any project context consider that before giving any reply.

        When the chatType is 'new', you should generate a new response based solely on the message provided and create a title for the chat based on the message.
        When the chatType is 'existing', you should generate a response that takes into account the previous context and projectContext, along with the new message.

        ProjectContext is optional and may be empty. If it is provided, you should consider it when generating your response.

        If ProjectContext is N/A, it means there is no project context available and should be empty for that particular query.

        Input:
        ${chatType === 'new'
            ? `Message: ${message}`
            : `Message: ${message}\nContext: ${context}\nProjectContext:${projectContext || 'N/A'}`}
    `;

    try {
        // 3. Use client.models.generateContent with a valid model
        const response = await client.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: jsonSchema
            }
        });

        // 4. Access parsed output text
        const responseText = response.text;
        console.log(responseText);
        return JSON.parse(responseText);

    } catch (error) {
        console.error('Gemini Request Failed:', error);
        throw error;
    }

}

module.exports = {
    processMessage
}