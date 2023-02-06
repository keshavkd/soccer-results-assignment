const { readLines, printResults } = require("../script");

const INVALID_FILE_NAME = ["", null, "temp.txt"];

const INVALID_INPUT = [
  "./data/invalid-input-1.txt", // Line 1: San Jose Earthquakes 3 Santa Cruz Slugs 3 (No dilimiter, ie; ", ")
  "./data/invalid-input-2.txt", // Line 1: San Jose Earthquakes, Santa Cruz Slugs 3 (No score for home team)
  "./data/invalid-input-3.txt", // Line 4: Felton Lumberjacks, Aptos FC 2 (No score for home team after finding number of games per match day)
  "./data/invalid-input-4.txt", // Line 4: Felton Lumberjacks 1, Aptos FC (No score for away team after finding number of games per match day)
  "./data/invalid-input-5.txt", // Number of games for the final match day is not valid according to the number of games per match day
  "./data/invalid-input-6.txt", // Line 1: San Jose Earthquakes 3, Santa Jose Earthquakes 2 (Same teams)
];

const VALID_SAMPLE_INPUT = "./data/sample-input.txt";

const EXPECTED_LINES = [
  "San Jose Earthquakes 3, Santa Cruz Slugs 3",
  "Capitola Seahorses 1, Aptos FC 0",
  "Felton Lumberjacks 2, Monterey United 0",
  "Felton Lumberjacks 1, Aptos FC 2",
  "Santa Cruz Slugs 0, Capitola Seahorses 0",
  "Monterey United 4, San Jose Earthquakes 2",
  "Santa Cruz Slugs 2, Aptos FC 3",
  "San Jose Earthquakes 1, Felton Lumberjacks 4",
  "Monterey United 1, Capitola Seahorses 0",
  "Aptos FC 2, Monterey United 0",
  "Capitola Seahorses 5, San Jose Earthquakes 5",
  "Santa Cruz Slugs 1, Felton Lumberjacks 1",
];

const EXPECTED_OUTPUT = [
  "Matchday 1",
  "Capitola Seahorses, 3 pts",
  "Felton Lumberjacks, 3 pts",
  "San Jose Earthquakes, 1 pt",
  "",
  "Matchday 2",
  "Capitola Seahorses, 4 pts",
  "Aptos FC, 3 pts",
  "Felton Lumberjacks, 3 pts",
  "",
  "Matchday 3",
  "Aptos FC, 6 pts",
  "Felton Lumberjacks, 6 pts",
  "Monterey United, 6 pts",
  "",
  "Matchday 4",
  "Aptos FC, 9 pts",
  "Felton Lumberjacks, 7 pts",
  "Monterey United, 6 pts",
  "",
];

describe("script", () => {
  describe("readLines", () => {
    it("should return a resolved promise with the correct lines when input is valid", async () => {
      const lines = await readLines(VALID_SAMPLE_INPUT);
      expect(lines).toEqual(EXPECTED_LINES);
    });

    it("should return a rejected promise with invalid filename", async () => {
      for (let file of INVALID_FILE_NAME) {
        await expect(readLines(file)).rejects.toBeDefined();
      }
    });
  });

  describe("printResults", () => {
    it("should return expected output with valid sample input", async () => {
      console.error = jest.fn();
      console.log = jest.fn();

      await readLines(VALID_SAMPLE_INPUT).then((games) => printResults(games));

      console.log.mock.calls.forEach((log, index) => {
        expect(log[0]).toEqual(EXPECTED_OUTPUT[index]);
      });

      expect(console.error).not.toBeCalled();
    });

    it("should return error messages with invalid sample input", async () => {
      console.error = jest.fn();

      for (let input of INVALID_INPUT) {
        await readLines(input).then((games) => printResults(games));
      }

      expect(console.error).toHaveBeenCalledTimes(INVALID_INPUT.length);
    });
  });
});
