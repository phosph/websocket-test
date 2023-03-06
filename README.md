# Websocket Test | Side-Stacker Game

This is essentially connect-four, but the pieces stack on either side of the board instead of bottom-up.

Two players see a board, which is a grid of 7 rows and 7 columns. They take turn adding pieces to a row, on one of the sides. The pieces stack on top of each other, and the game ends when there are no spaces left available, or when a player has four consecutive pieces on a diagonal, column, or row.

For example, the board might look like this:
```
0 [ _ _ _ _ _ _ _ ]
1 [ o x _ _ _ _ o ]
2 [ x _ _ _ _ _ x ]
3 [ x _ _ _ _ _ o ]
4 [ o _ _ _ _ _ _ ]
5 [ _ _ _ _ _ _ _ ]
6 [ _ _ _ _ _ _ _ ]
```
in this case, it is x’s turn. If x plays (2, R), the board will look like this:
```
0 [ _ _ _ _ _ _ _ ]
1 [ o x _ _ _ _ o ]
2 [ x _ _ _ _ x x ]
3 [ x _ _ _ _ _ o ]
4 [ o _ _ _ _ _ _ ]
5 [ _ _ _ _ _ _ _ ]
6 [ _ _ _ _ _ _ _ ]
```

The take-home task is to implement the 2-player version of this game, where each player sees the board in their frontend and can place moves that the other player sees, and the game should display “player 1 won” “player 2 lost” when the game is complete.

Please store the game in the backend using a relational database; how you define your models is up to you. You should not have to refresh the page to see your opponent’s moves.

---

## Project Setup Requirements

### The Frontend

The frontend must be written in ES7 Javascript, you may use React, or no framework at all, but don’t use Angular, Vue, or another large JS framework (Lodash/jQuery/etc are fine). We tend to use the prettier.io JS style with no semicolons in our codebase, but we’re not strict about any specific code style in the interviews and take-homeprojects, just be consistent with whatever you choose.

Javascript build environments can be tricky to set up, to avoid the hassle of dealing with a bundler, we recommend using standard ES6 with import syntax (it’s supported by all modern browsers now), or sticking to a boilerplate system like create-react-app. We don’t require supporting older browsers for our tasks.

### The Backend

If your task requires a backend, it can be written in JavaScript, Rust, or Python >=3.7. You may use any python backend framework or ORM as needed, e.g. Django, Flask, Bottle, Pyramids/Pylons, etc.

The frontend and backend may interact via REST API, or websocket. You can choose how to implement it, but real-time streaming can be tricky, so you may choose to send drawing strokes or board moves when a user clicks a button instead of sending events continuously. If you’re familiar with websockets, then we recommend using them instead.

---
