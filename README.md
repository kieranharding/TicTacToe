# Tic Tac Toe
This is my implimentation of [Free Code Camp's](www.freecodecamp.com)
[Tic Tac Toe](https://www.freecodecamp.com/challenges/build-a-tic-tac-toe-game)
challenge.

## Planning
* Like the [Pomodoro Timer](https://kieranharding.github.io/pomodoro), this looks
like an opportunity to use a State Design Pattern.
  * This time, put the states inside the board object, or eliminate the board
  altogether and use only states.
  * Try using a Prototype design pattern.
* Modeling the board in Javascript.
  * Using a 2D array is obvious; rows and columns very easy to check.
  * Using a 1D array to 9 is another simple option.
  * For storing all positions, I can also parse the visible board each time. I
  did this for the Pomodoro timer in some cases, but I think it starts to get
  confused jumping between Javascript and HTML for where the information is.
* Start with a 'Two Player' mode.
* When the time comes, the second answer on
[this page](https://www.quora.com/Is-there-a-way-to-never-lose-at-Tic-Tac-Toe)
apparently shows how to never lose, so use that for the computer player.
