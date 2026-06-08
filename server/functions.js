// require libraries
const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, ".env")
});
const { configuration, GetData, uploadProcessData,randomId } = require('./crud.js');
const OpenAI = require("openai");
const { FirebaseError } = require('firebase/app');
const fs = require("fs")
// Get the chatbot_res document data
async function getUniqueDocumentAsJson(collectionName) {
    try {
        configuration();
        const documents = await GetData(collectionName);
        if (documents && documents.length > 0) {
            return documents;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
}
// LLM request using groq api and openai models
async function get_ai_res(prompt) {
    const client = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });
    try {
        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [{role:"user",content:`${prompt}`}],
        });
        // Note: OpenAI SDK standard structure uses choices[0].message.content
        return response.choices[0].message.content ;
    } catch (error) {
        console.error("Error fetching response:", error);
        return "Sorry, an error occurred while communicating with the smart service.";
    }
}

// the following function is either give the answer of this question that was asked before or try to find similar reponse
async function FromFireStore(question){
    const retrievedQuestions = await getUniqueDocumentAsJson("chatbot_res");
    if (!retrievedQuestions) {
        return {infirebase:false,storedFBqst:[],json_answers:{}};
    }
    let qst = [] 
    let pair_qst_answr = {}
    let NumOfPrevQst = retrievedQuestions.length
    for(let i=0;i<NumOfPrevQst;i++){
        const objQA = retrievedQuestions[i] // object of <question:answer>
        if(objQA.question==question){
            return {infirebase:true,answer:objQA.answer};
        }
        else{
            qst.push(objQA.question)
            pair_qst_answr[objQA.question] = objQA.answer;
        }
    }
    return {infirebase:false,storedFBqst:qst,json_answers:pair_qst_answr};
}
async function SimilarQuestion(question,stores_qst){
    if (stores_qst.length === 0) return -1;
    const data = await get_ai_res(
        `TASK:
        You are given:
        1) a user question
        2) an array of stored questions

        Your job is to find the index of the stored question that has the closest meaning to the user question.

        User question:
        "${question}"

        Stored questions array:
        ${stores_qst}

        RULES:
        - Compare based on MEANING, not exact words.
        - Consider paraphrasing, synonyms, and similar intent.
        - Return ONLY the index number (0-based index).
        - If no stored question has a clearly similar meaning, return -1.
        - Do NOT return explanations.
        - Do NOT return text.
        - Output must be a single number only.

        OUTPUT FORMAT EXAMPLES:
        0
        3
        -1`
    );
    return Number(data);
}
async function FromDoc(question){
    try {
        const data = await fs.promises.readFile(`${__dirname}/guide.txt`, "utf-8");
        const answer = await get_ai_res(`
            ROLE:
            You are an assistant that answers user questions ONLY using the provided document.

            USER QUESTION:
            "${question}"

            DOCUMENT CONTENT:
            ${data}

            INSTRUCTIONS:
            - Carefully read the document.
            - Try to find the most relevant information that answers the user question.
            - Base your answer ONLY on the document content.
            - Do NOT invent information that does not exist in the document.
            - If multiple relevant parts exist, summarize them clearly.
            - Keep the answer clear and concise (max 5 lines).
            - Answer in English.

            IF NO ANSWER IS FOUND:
            Return EXACTLY the following message (without modification):

            Sorry, we don't have enough information about the question you asked. Please contact our support team directly via email:
            <a href="mailto:rsbhousedz@gmail.com">Click here</a>
            Or through the contact form on the homepage:
            <a href="/#contactus">Click here</a>

            OUTPUT RULES:
            - Return only the final answer.
            - Do not explain your reasoning.
            - Do not mention the document.
            - Do not return JSON.
            - Output must be plain text with HTML links if needed.
        `);
        return answer;
    } catch (err) {
        console.error(err);
        return "Sorry, an error occurred while accessing the information.";
    }
}
async function Chatbot(qst) {
    const firebaseResult = await FromFireStore(qst);
    if(firebaseResult.infirebase){
        return firebaseResult.answer;
    }
    else{
        let answr;
        const similarResult = await SimilarQuestion(qst,firebaseResult.storedFBqst);
        if(similarResult!=-1){
            answr = firebaseResult.json_answers[firebaseResult.storedFBqst[similarResult]];
        }
        else{
            answr = await FromDoc(qst);
        }
        if(typeof answr === "string" && !answr.includes("Sorry")){
            configuration();
            const couple_qst_answr = {question:qst,answer:answr}
            await uploadProcessData(couple_qst_answr,"chatbot_res",randomId())
        }
        return answr
    }
}
module.exports = {
    Chatbot,getUniqueDocumentAsJson
}