## The Problem

We want you to create a script that reads a listing of game
results for a soccer league and prints the top teams at
the end of each matchday.

### Input/output

The input and output will be text. A static file will be
used to represent the game results.

Your solution should read the input file, then print the correct results via stdout to the console.

The input contains results of games, one per line and grouped by matchday. All
teams play exactly once during a matchday, for example given a league of six teams,
each matchday would consist of three games. There is no specific delimiter
between matchdays so your application should recognize the start and end of
a matchday. See sample-input.txt as an example.
Notice that:

- the only provided input is the result of games, no other type of input is provided to the software
- the number of teams participating in a league is unknown and should be determined by the software
- the teams participating in a league are unknown and should be determined by the software

After reading and processing a game result (a line is a game result), if the software determines that the matchday has ended,
the solution should output the top three teams, ordered from most to least
points. If the matchday hasn't ended, the solution should move on to
the next game result. See the expected format specified in expected-output.txt.

### The rules

In this league, a draw (tie) is worth 1 point and a win is worth 3 points. A
loss is worth 0 points. If two or more teams among the top three teams have
the same number of points, they should have the same rank and be printed in
alphabetical order. That said, at most three teams should be listed in the
output per matchday.

### Guidelines

This should be implemented in a language with which you are familiar. We would
prefer that you use ruby, javascript, typescript, or go, if you are
comfortable doing so. If none of these are comfortable, please choose a
language that is both comfortable for you and suited to the task.

Your solution should be able to be run (and if applicable, built) from the
command line. Please include:

- appropriate scripts and instructions for running your application
- appropriate instructions to run your tests
- a design document explaining your thought process

We write automated tests and we would like you to do so as well.

We appreciate clean and well factored designs.

Anything that isn't explicitly specified or is unclear is up to you to
decide.

Read this document carefully, you will be graded on how well you follow it.

### Platform support

This will be run in a unix or OS X environment. If you choose to use a
compiled language, please keep this in mind. Please use platform-agnostic constructs where
possible (line-endings and file-path-separators are two problematic areas).

Please email your sponsor at Jane if you have any questions.
