# Wer?Wolf

An online version of the game Werewolf. This is a project for the course "Software Engineering" at the FH Campus Wien.


Our team consists of:
Lead Developer: Anna Zierlinger
Lead Designer: Tobias Kaltenbrunner
Lead Coordinator: Stefanie Biber

**1.3.	Product scope**

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
