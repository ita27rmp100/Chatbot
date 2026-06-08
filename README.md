# ChatBot
A customizable AI chatbot that can be seamlessly integrated into any website.
**License:** MIT.
**Created by:** Abderahim. 
---
## Built with:
- Node.js
- Firebase with Firestore
> You can use Supabase instead of Firebase (as an SQL database); you will need to modify the CRUD operations in [crud.js](https://github.com/ita27rmp100/Chatbot/blob/main/server/crud.js)
## Basis of this project:
- An information file named **guide.txt**.
- A collection of questions in Firestore named "chatbot_res".
- An LLM (e.g., OpenAI) is used to analyze the *guide.txt* file and the *chatbot_res* collection to extract or generate answers.
---
## Simple Overview:
![Overview](docs/overview.png)
---
## How it works:
![UML](docs/UML_sequence_diagram.png)
---
## Contributions:
Contributions and suggestions are welcome.
And don't forget to give this repo a **STAR** and thank you <3 .