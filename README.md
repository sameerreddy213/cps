# 🎓 CPS Personalized Learning System Using Knowledge Graph
An AI-powered platform that delivers personalized learning paths using knowledge graphs and adaptive quizzes.

## 🚀 Features
- User Authentication
- Personalized Recommendations via Concept Graph
- Quiz Generation using GPT-4o (RAG)
- Mastery-based Weight Updates
- Progress Visualization

## 🧠 How It Works
1. User selects learned and target topics.
2. System finds shortest path using the concept graph.
3. Quizzes are generated per topic using RAG.
4. Scores update mastery weights between 0.1–0.9.
5. Future recommendations adapt based on mastery.

## 🛠 Tech Stack
| Tech         | Purpose                              |
|--------------|--------------------------------------|
| React + TypeScript | Frontend                         |
| Node.js + Express  | Backend APIs                     |
| MongoDB       | Persistent storage                    |
| OpenAI GPT-4o | Quiz generation using RAG             |
| Zustand       | Global state management               |
| Tailwind CSS  | UI styling                            |


## 📂 Project Structure
client/
server/
data/


## 📦 Setup & Installation

1. Clone the repo
2. Install dependencies
3. Setup environment variables
4. Run dev servers
 {(cd client;npm run dev)
(cd server;npm run dev)---> All set!!
ensure the portno. of client to be 5173}

## 📊 Future Enhancements
- Gamification badges
- Teacher dashboard
- More granular topic-level quizzes
- Enhance recommendation engine on advanced DSA topics
- UI improvements as always


## 🙌 Acknowledgments
- MIT OCW for scraped content
- OpenAI for GPT-4o API
-IIT Ropar for the mentor and tech supoort and a lovely team.



## 📃 License
This project is licensed under the MIT License.
