// require("dotenv").config();
// const OpenAI = require("openai");

// // Initialize the client


// async function get_ai_res(prompt) {
//     const client = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//       baseURL: "https://api.groq.com/openai/v1",
//     });
//     try {
//         const response = await client.chat.completions.create({
//             model: "openai/gpt-oss-20b",
//             messages: [{role:"user",content:`${prompt}`}],
//         });
//         // Note: OpenAI SDK standard structure uses choices[0].message.content
//         return response.choices[0].message.content ;
//     } catch (error) {
//         console.error("Error fetching response:", error);
//         return error;
//     }
// }

// get_ai_res("say hello world").then((data) =>{
//   console.log(data)
// });
require("dotenv").config()
console.log(__dirname)
console.log(process.env.OPENAI_API_KEY)