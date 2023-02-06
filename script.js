/*
 * Script to parse a soccer results file, get the scores and return the top 3 teams with the highest scores
 * at the end of each match day.
 */

const fs = require("fs");
const { Heap } = require("@datastructures-js/heap");

// Index constants for Team
const TEAM_NAME = 0;
const TEAM_SCORE = 1;

let gamesPerMatchDay = 0;

// Map of team names and their scores after every match day
let teamMap = new Map();

/*
 * Returns a promise with an array of lines in the given file.
 * This function reads a file line by line to avoid storing the entire file in memory.
 * @param => fileName: string, Name of file to read
 * @return => promise, Array<string>, Lines in the file in the form of an array, or logs an error message
 */
const readLines = async (fileName) => {
  return new Promise((resolve, reject) => {
    let games = [];
    const stream = fs.createReadStream(fileName, "utf-8");
    let data = "";

    stream.on("readable", function () {
      let chunk;
      while ((chunk = stream.read())) {
        data += chunk;
        let lines = data.split(/\r?\n/);
        data = lines.pop();
        for (const line of lines) {
          games.push(line);
        }
      }
    });

    stream.on("end", function () {
      // Skips empty lines or lines with white spaces
      resolve(games.filter((str) => str.trim().length !== 0));
    });

    stream.on("error", function (err) {
      reject(err);
    });
  });
};

/*
 * Comparator for max heap that is based on score and then lexicographically based on the team name if scores are equal
 * @param => a: Object {score: integer, name: string}
 * @param => b: Object {score: integer, name: string}
 * @return => 1/-1: number, based on comparison logic
 */
const compareResults = (a, b) => {
  if (a.score < b.score) return 1;
  if (a.score > b.score) return -1;
  return a.name < b.name ? -1 : 1;
};

/*
 * Helper function that returns the name of the teams and their corresponding scores for the day
 * @param => str: string, Line that contains both home and away, team names and scores
 * @return => Array<Array<string, integer>>, A 2D array of home, away team names and scores on valid str input /
 * @return => Array<null>, When str is invalid
 */
const getHomeAndAway = (str) => {
  let [home, away] = str.split(", ");
  if (away == null) return [null];
  let homeTeam = home.split(" ");
  let awayTeam = away.split(" ");
  // Team scores
  let homeScore = homeTeam.pop();
  let awayScore = awayTeam.pop();
  // Team names
  homeTeam = homeTeam.join(" ");
  awayTeam = awayTeam.join(" ");
  return [
    [homeTeam, parseInt(homeScore)],
    [awayTeam, parseInt(awayScore)],
  ];
};

/*
 * Function that prints the results of all match days (atmpst top 3 teams) to the console
 * @param => games: Array<string>, Array of lines that contain all games
 * @return => void
 */
const printResults = (games) => {
  // Initial check to find the number of games per match day based on unique team names
  for (let i = 0; i < games.length; i++) {
    let [home, away] = getHomeAndAway(games[i]);

    // Checks if the current line is invalid
    if (home == null || away == null) {
      console.error(`[ERROR] Issue with line ${i}: ${games[i]}`);
      return;
    }

    if (teamMap.has(home[TEAM_NAME]) || teamMap.has(away[TEAM_NAME])) break;
    teamMap.set(home[TEAM_NAME], 0);
    teamMap.set(away[TEAM_NAME], 0);
    gamesPerMatchDay += 1;
  }

  // Checks if the number of games in the file is not a multiple of number games per match day
  if (games.length % gamesPerMatchDay !== 0) {
    console.error(
      `[ERROR] Expected number of games to be a multiple of ${gamesPerMatchDay} but received: ${games.length}`
    );
    return;
  }

  for (let i = 1; i <= games.length; i++) {
    let [home, away] = getHomeAndAway(games[i - 1]);

    // Checks if the line is invalid
    if (
      home == null ||
      away == null ||
      isNaN(home[TEAM_SCORE]) ||
      isNaN(away[TEAM_SCORE])
    ) {
      console.error(`[ERROR] Issue with line ${i}: ${games[i - 1]}`);
      return;
    }

    // Logic to increment scores of teams based on the match score
    if (home[TEAM_SCORE] > away[TEAM_SCORE]) {
      teamMap.set(home[TEAM_NAME], teamMap.get(home[TEAM_NAME]) + 3);
    } else if (home[TEAM_SCORE] < away[TEAM_SCORE]) {
      teamMap.set(away[TEAM_NAME], teamMap.get(away[TEAM_NAME]) + 3);
    } else {
      teamMap.set(home[TEAM_NAME], teamMap.get(home[TEAM_NAME]) + 1);
      teamMap.set(away[TEAM_NAME], teamMap.get(away[TEAM_NAME]) + 1);
    }

    // Prints match day results if current line is a multiple of number games per match day
    if (i % gamesPerMatchDay === 0) {
      // Creating heap based on teamMap results for the match day
      const gameHeap = Heap.heapify(
        [...teamMap].map(([name, score]) => ({ name, score })),
        compareResults
      );

      console.log(`Matchday ${i / gamesPerMatchDay}`);
      let k = 0;
      while (k < 3 && !gameHeap.isEmpty()) {
        let { name, score } = gameHeap.extractRoot();
        console.log(`${name}, ${score} pt${score !== 1 ? "s" : ""}`);
        k++;
      }

      console.log("");
      // Clearing the heap after the end of the match day to store new results in the next iteration
      gameHeap.clear();
    }
  }
};

/*
 * Driver function to run the script from the commandline (file name sent as an argument via process.argv)
 * @param => void
 * @return => void
 */
const driverFunction = () => {
  readLines(process.argv[2])
    .then((games) => printResults(games))
    .catch((err) => console.error(`[ERROR] ${err.message}`));
};

// Check to see if script.js file has been called from the commandline and not from a module import
if (require.main === module) driverFunction();

// Exports modules for jest tests
module.exports = {
  readLines,
  printResults,
};
