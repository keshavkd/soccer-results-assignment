const fs = require("fs");
const { Heap } = require("@datastructures-js/heap");

const TEAM_NAME = 0;
const TEAM_SCORE = 1;

let gamesPerMatchDay = 0;
let teamMap = new Map();

const readLines = async (fileName) => {
  return new Promise((resolve, reject) => {
    try {
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
        resolve(games.filter((str) => str.trim().length !== 0));
      });

      stream.on("error", function (err) {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
};

const compareResults = (a, b) => {
  if (a.score < b.score) return 1;
  if (a.score > b.score) return -1;
  return a.name < b.name ? -1 : 1;
};

const getHomeAndAway = (str) => {
  let [home, away] = str.split(", ");
  if (away == null) return [null];
  let homeTeam = home.split(" ");
  let awayTeam = away.split(" ");
  let homeScore = homeTeam.pop();
  let awayScore = awayTeam.pop();
  homeTeam = homeTeam.join(" ");
  awayTeam = awayTeam.join(" ");
  return [
    [homeTeam, parseInt(homeScore)],
    [awayTeam, parseInt(awayScore)],
  ];
};

const printResults = (games) => {
  for (let i = 0; i < games.length; i++) {
    let [home, away] = getHomeAndAway(games[i]);

    if (home == null || away == null) {
      console.error(`[ERROR] Issue with line ${i}: ${games[i]}`);
      return;
    }

    if (teamMap.has(home[TEAM_NAME]) || teamMap.has(away[TEAM_NAME])) break;
    teamMap.set(home[TEAM_NAME], 0);
    teamMap.set(away[TEAM_NAME], 0);
    gamesPerMatchDay += 1;
  }

  if (games.length % gamesPerMatchDay !== 0) {
    console.error(
      `[ERROR] Expected number of games to be a multiple of ${gamesPerMatchDay} but received: ${games.length}`
    );
    return;
  }

  for (let i = 1; i <= games.length; i++) {
    let [home, away] = getHomeAndAway(games[i - 1]);

    if (
      home == null ||
      away == null ||
      isNaN(home[TEAM_SCORE]) ||
      isNaN(away[TEAM_SCORE])
    ) {
      console.error(`[ERROR] Issue with line ${i}: ${games[i - 1]}`);
      return;
    }

    if (home[TEAM_SCORE] > away[TEAM_SCORE]) {
      teamMap.set(home[TEAM_NAME], teamMap.get(home[TEAM_NAME]) + 3);
    } else if (home[TEAM_SCORE] < away[TEAM_SCORE]) {
      teamMap.set(away[TEAM_NAME], teamMap.get(away[TEAM_NAME]) + 3);
    } else {
      teamMap.set(home[TEAM_NAME], teamMap.get(home[TEAM_NAME]) + 1);
      teamMap.set(away[TEAM_NAME], teamMap.get(away[TEAM_NAME]) + 1);
    }

    if (i % gamesPerMatchDay === 0) {
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
      gameHeap.clear();
    }
  }
};

const driverFunction = () => {
  readLines(process.argv[2])
    .then((games) => printResults(games))
    .catch((err) => console.error(`[ERROR] ${err.message}`));
};

if (require.main === module) driverFunction();

module.exports = {
  readLines,
  printResults,
};
