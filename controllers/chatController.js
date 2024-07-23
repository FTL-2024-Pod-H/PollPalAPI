// chatController.js
const {getChatHistory, saveChatMessage} = require("../models/chatModel");
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
});

const chatHandler = async (req, res) => {
    const {prompt, conversationId} = req.body;

    if (!prompt){
        return res.status(400).send("Prompt is required to get a response :(");
    }

    try{
        let messages = [
            {role: "system", content: "You are an AI assistant specialized in the US electoral system. Provide accurate and up-to-date information about the election process, government positions, the electoral college, and other relevant topics. If you don't have updated or accurate information, inform the user instead of trying to find a response to a prompt you don't know the answer to."},
        ];
        if (conversationId) {
            const previousMessages = await getChatHistory(conversationId);

            previousMessages.forEach((msg) => {
                messages.push({role: "user", content: msg.prompt});
                messages.push({role: "assistant", content: msg.response});
            });
        }

        messages.push({role: "user", content: prompt});

        const completion = await openai.chat.completions.create({
            model:"gpt-4o-mini",
            messages: messages,
        })

        const chatResponse = completion.choices[0].message.content.trim();

        const newConversationId = conversationId || Date.now().toString();
        await saveChatMessage(newConversationId, prompt, chatResponse);

        res.json({
            prompt: prompt,
            response: chatResponse, 
            conversationId: newConversationId,
        });
    } catch(error){
        console.error(error);
        res.status(500).send("Oops! Something went wrong :(");
    }
};

module.exports = {
    chatHandler,
}