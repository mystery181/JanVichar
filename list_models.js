
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    try {
        // For listing models we might need to use the model service directly or just try to instantiate and run.
        // The SDK doesn't have a direct listModels method on the client instance easily accessible in all versions.
        // Let's use fetch directly for certainty.
        const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        console.log("Checking models with key ending in...", key.slice(-4));

        // Using fetch to list models
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.name.includes("embedding")) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
