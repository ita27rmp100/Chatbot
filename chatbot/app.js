// const { Chat } = require('openai/resources/index.js');
const { Chatbot , getUniqueDocumentAsJson} = require('./functions.js');

async function main() {
    const req = await Chatbot("كيف أبحث عن سكن ؟");
    console.log(req)
    // const req = await getUniqueDocumentAsJson("properties");
    // console.log(req)
}

main()