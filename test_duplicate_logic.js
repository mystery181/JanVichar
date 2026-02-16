
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

// Mock similarity function from src/lib/gemini.ts
function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function testLogic() {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    // Using the model currently in src/lib/gemini.ts
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    const text1 = "Water shortage in South Delhi due to pipeline burst";
    const text2 = "Lack of water supply in Delhi area impacting residents";
    const text3 = "New school opening in Mumbai";

    console.log("Generating embeddings...");
    try {
        const result1 = await model.embedContent(text1);
        const vec1 = result1.embedding.values;
        console.log("Vector 1 generated, length:", vec1.length);

        const result2 = await model.embedContent(text2);
        const vec2 = result2.embedding.values;
        console.log("Vector 2 generated, length:", vec2.length);

        const result3 = await model.embedContent(text3);
        const vec3 = result3.embedding.values;
        console.log("Vector 3 generated, length:", vec3.length);

        const score1_2 = cosineSimilarity(vec1, vec2);
        console.log(`Similarity (Water vs Water): ${score1_2.toFixed(4)} (Expected > 0.6)`);

        const score1_3 = cosineSimilarity(vec1, vec3);
        console.log(`Similarity (Water vs School): ${score1_3.toFixed(4)} (Expected Low)`);

        if (score1_2 > 0.6) {
            console.log("SUCCESS: Logic correctly detects similarity.");
        } else {
            console.log("FAILURE: Similarity score too low for related texts.");
        }

    } catch (error) {
        console.error("Error generating embeddings:", error);
    }
}

testLogic();
