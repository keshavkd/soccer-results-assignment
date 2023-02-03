const fs = require("fs");
const { Heap } = require("@datastructures-js/heap");

const TEAM_NAME = 0;
const TEAM_SCORE = 1;

const input = fs.readFileSync("data/sample-input.txt", "utf8");
const games = input.split("\n").filter((str) => str.trim().length !== 0);

let gamesPerMatchDay = 0;
let teamMap = new Map();

const compareResults = (a, b) => {
  if (a.score < b.score) return 1;
  if (a.score > b.score) return -1;
  return a.name < b.name ? -1 : 1;
};

const getHomeAndAway = (str) => {
  let [home, away] = str.split(", ");
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

(function () {
  for (let i = 0; i < games.length; i++) {
    let [home, away] = getHomeAndAway(games[i]);
    if (teamMap.has(home[TEAM_NAME]) || teamMap.has(away[TEAM_NAME])) break;
    teamMap.set(home[TEAM_NAME], 0);
    teamMap.set(away[TEAM_NAME], 0);
    gamesPerMatchDay += 1;
  }

  for (let i = 1; i <= games.length; i++) {
    let [home, away] = getHomeAndAway(games[i - 1]);

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
})();
