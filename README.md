# Soccer Results - Take Home Assignment

Script to parse a soccer results file, get the scores and return the top 3 teams with the highest scores at the end of each match day.

## Installation

- [Download and install node](https://nodejs.org/en/download/)
- Download this github repository and open command-line in the directory.
- Install dependencies (datastructures-js and jest)

```
npm install
```

## Usage

- In the directory, open command-line and run:

```
node script.js data/sample-input.txt
```

- To run tests:

```
npm test
```

## Design

The problem can be divided into three main sections.

- Parsing the input file and storing the resulting lines.
- Finding number of games per match day
- Comparing results of each game and printing the result after every match day

##### Parsing the input file and storing the resulting lines

Reading the entire file and then splitting by lines will result in storing the file in memory while reading. Issues might arise if the file is extremely large. Instead, opening the file and creating an input stream for lines is ideal since we will not have a memory overhead issue to worry about. We will also sanitize the input for empty lines or lines with whitespaces only.

##### Finding number of games per match day

From the problem statement, we know for a fact that all teams must play once per match day. Storing the teams in a map or a set will allow us to know if a team exists already while reading further lines. If we come across a team that already exists in the set/map, we know for a fact that this is the start of a new matchday. We start a counter (gamesPerMatchday) from 0 and increment it untill we find the start of a new match day. Using a map to store teams is ideal as we can store the name and score as a key value pair respectively. Initially, the score will be set to 0. We will handle the actual score updates in the next section.

##### Comparing results of each game and printing the result after every match day

The main reason as to why we use a Max Heap here is to reduce the time taken to sort the highest scores after every match day. Generally sorting would take O(nlogn) but using Heapify would take O(n) instead and getting the top 3 teams would be O(1) each.

- First sanitize the line and get corresponding team names and scores
- Store the result of the game in the map after comparing scores
- Check to see if the line is a multiple of number of games per match day. If this is true, start the print logic by creating a max heap and printing the top three teams.
- Check until the Heap is empty (for lesser than three teams) or counter is less than or equal to 3 while removing the team with the most points.
- Finally print the removed object's team name from the map with their total number of points.
