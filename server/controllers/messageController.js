import Chat from "../models/Chat.js";
import User from "../models/User.js";
import openai from "../configs/openai.js";

//text-based AI Chat message Controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt } = req.body;

        if (!chatId || !prompt) {
            return res.json({ success: false, message: "chatId and prompt are required" });
        }

        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.json({ success: false, message: "Chat not found" });
        }

        // Add user message
        chat.messages.push({
            role: 'user',
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        });

        // Call OpenAI API
        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        // Add AI response
        const reply = {
            role: choices[0].message.role,
            content: choices[0].message.content,
            timestamp: Date.now(),
            isImage: false
        };

        chat.messages.push(reply);
        await chat.save();

        res.json({ success: true, reply });

    } catch (error) {
        console.error("Text message error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Image-based AI Chat message Controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt } = req.body;

        if (!chatId || !prompt) {
            return res.json({ success: false, message: "chatId and prompt are required" });
        }

        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.json({ success: false, message: "Chat not found" });
        }

        // Add user message
        chat.messages.push({
            role: 'user',
            content: prompt,
            timestamp: Date.now(),
            isImage: true
        });

        // Call OpenAI API for image generation
        const imageResponse = await openai.images.generate({
            model: "dall-e-2",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        // Add AI response
        const reply = {
            role: 'assistant',
            content: imageResponse.data[0].url,
            timestamp: Date.now(),
            isImage: true
        };

        chat.messages.push(reply);
        await chat.save();

        res.json({ success: true, reply });

    } catch (error) {
        console.error("Image message error:", error);
        res.json({ success: false, message: error.message });
    }
};