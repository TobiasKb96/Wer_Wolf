# Wer?Wolf

An online version of the game Werewolf. This is a project for the course "Software Engineering" at the FH Campus Wien.

## Team Members
* Lead Developer: Anna Zierlinger
* Lead Designer: Tobias Kaltenbrunner
* Lead Coordinator: Stefanie Biber

## Overview
The **Wer_Wolf** application is an interactive multiplayer game designed to be played in groups, with roles assigned to players and various game phases such as day and night. The application consists of a backend server and a frontend client.

This guide provides detailed instructions on how to install and use the application.

---

## Prerequisites
Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v14 or later)
- **npm** (Node Package Manager)
- **Git** (optional, for cloning the repository)

---

## Installation

### 1. Clone or Download the Repository

#### Option 1: Clone with Git
Run the following command in your terminal:
```bash
git clone <repository-url>
cd Wer_Wolf
```

#### Option 2: Download as ZIP
1. Click the **Download ZIP** button on the repository page.
2. Extract the contents of the ZIP file.
3. Navigate to the extracted `Wer_Wolf` folder.

### 2. Install Dependencies
The application has two main components: the backend (server) and the frontend (client). Dependencies must be installed for both.

#### Backend (Server):
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```

#### Frontend (Client):
1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```

---

## Running the Application

### 1. Start the Backend Server
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Start the server:
   ```bash
   npm run dev
   ```

The server will start and listen on the configured port (default: `http://localhost:5000`).

### 2. Start the Frontend Client
1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Start the client:
   ```bash
   npm run build
   ```

The client will start and open the application in your default web browser (default: `http://localhost:3000`).

---

## Usage

### Creating a Game
1. Navigate to the game page in your browser.
2. Click the **Create New Game** button to start a new session.
3. A QR code will be displayed, allowing players to join the game by scanning it or using the provided link.

### Joining a Game
1. Players can join by scanning the QR code or navigating to the session link in their browser.
2. Enter a username and wait for the host to start the game.

### Playing the Game
The game progresses through various phases:
- **Day Phase**: Players discuss and vote on actions.
- **Night Phase**: Certain roles take secret actions.

Follow on-screen instructions to participate in the game.

---
## Additional Information

### 1.3.	Product scope

1.3.1.	Must-criteria

1. The system shall provide the users with the ability to play a game of Werewolf with a narrator.
2. The system shall provide the user with a one time login QR code for the players to enter the game session.
3. The system shall be accessible through a web server without requiring downloads or an app.
4. The system shall assign random roles to the users entering the game.
5. The system shall provide 2 playable characters, werewolf and villager
6. The system shall manage game phases to differentiate between day and night.
7. The system shall provide the narrator with an overview of the characters of the players.
8. The system shall display the narrator’s script, including all necessary prompts and instructions, on the narrator’s device. - Tobs
9. The system shall be able to distribute player roles between up to 8 players per game session.
10. The system shall allow players to choose their name when joining a lobby done

1.3.2.	Should-criteria

The system should include a chat option for the players to communicate with each other. Any Player can contact any other Player during daytime, to anonymously agree on strategies. Anna
The system should enable players to vote to eliminate another player.
The system should provide the players with timers for actions like voting.
The system should send a message if a player has been eliminated. ATM only to narrator, OPEN: send msg to all player about eliminated player – via narrator?

1.3.3.	Could-criteria (fully automated, no need for a narrator)

1. The system could include additional roles if more players are participating (witch,..). Anna
2. The system could allow the players to play a game without the need of a human narrator by automating all of his tasks.
3. The system could provide the user with the ability to create their own characters. (Character ist eine eigene Gruppe von Spielern mit eigenem Goal, separat von Villagern; Goal selbst definiert)
4. The system could be able to distribute player roles between up to 35 players per game session. Anna

1.3.4.	Won‘t-criteria

1. The system won‘t require the user to create an account or log in.
2. The system won’t save Sessions in case of a critical system error

### Folder Structure
- **client/**: Contains the React frontend application.
- **server/**: Contains the Node.js backend server.
- **package.json**: Lists project dependencies and scripts.

### Scripts
Run the following scripts in either `client` or `server` folders:

- `npm run dev`: Start the application in development mode.
- `npm run build`: Build the application for production (frontend only).

### Troubleshooting
If you encounter issues:
- Ensure all dependencies are installed with `npm install`.
- Check if the required ports (5000 for the server, 3000 for the client) are available.
- Review the console output for error messages.

---

## Contributions
Contributions are welcome! Feel free to submit a pull request or open an issue on the repository.

