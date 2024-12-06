import { describe, test } from "jsr:@std/testing/bdd";
import { InputParser, parseMatrix } from "@input";
import { assertEquals, assertThrows } from "jsr:@std/assert";
import { mapMatrixToString } from "@arrays";

describe("The input parser", () => {
  describe("when nothing has been parsed yet", () => {
    test("should hold input", () => {
      // given
      const input = "Some input";

      // when
      const parser = new InputParser(input);

      // then
      assertEquals(input, parser.raw);
    });

    describe("when printing the input", () => {
      test("should print input if no input mapper fn is specified", () => {
        // given
        const input = "Some input";
        const parser = new InputParser(input);
        // spy on console log
        const originalLog = console.log;
        let loggedOutput = "";
        console.log = (output) => (loggedOutput = output);

        try {
          // when
          parser.printInput();

          // then
          assertEquals(loggedOutput, input);
        } finally {
          console.log = originalLog;
        }
      });

      test("should apply input mapper fn if specified ", () => {
        // given
        const input = "Some input";
        const parser = new InputParser(input);
        // spy on console log
        const originalLog = console.log;
        let loggedOutput = "";
        console.log = (output) => (loggedOutput = output);

        try {
          // when
          parser.printInput((input) => input + " mapped");

          // then
          assertEquals(loggedOutput, input + " mapped");
        } finally {
          console.log = originalLog;
        }
      });
    });

    test("should log warning when attempting to print parsed content", () => {
      // given
      const input = "Some input";
      const parser = new InputParser(input);
      // spy on console log
      const originalWarn = console.warn;
      let loggedOutput = "";
      console.warn = (output) => (loggedOutput = output);

      try {
        // when
        parser.printParsed();

        // then
        assertEquals(
          loggedOutput,
          "Nothing parsed yet, cannot apply print function",
        );
      } finally {
        console.log = originalWarn;
      }
    });

    test("should apply input mapper fn if specified ", () => {
      // given
      const input = "Some input";
      const parser = new InputParser(input);
      // spy on console log
      const originalLog = console.log;
      let loggedOutput = "";
      console.log = (output) => (loggedOutput = output);

      try {
        // when
        parser.printInput((input) => input + " mapped");

        // then
        assertEquals(loggedOutput, input + " mapped");
      } finally {
        console.log = originalLog;
      }
    });

    test("should throw error when input is has not been parsed", () => {
      // given
      const input = "Some input";

      // when
      const parser = new InputParser(input);

      // then
      assertThrows(
        () => parser.getParsed(),
        Error,
        "Invalid state: nothing parsed yet",
      );
    });
  });

  describe("when parsing the input", () => {
    test("should apply the parse fn", () => {
      // given
      const parser = new InputParser("Some input");
      type TargetType = {
        original: string;
        mapped: string;
      };

      // when
      const parsed = parser.parseLines((input) => ({
        original: input,
        mapped: input + " mapped",
      } as TargetType));

      // then
      assertEquals(parsed.getParsed(), {
        original: "Some input",
        mapped: "Some input mapped",
      });
    });
  });

  describe("when parsing the input to matrix", () => {
    test("should be able to convert to string matrix by default", () => {
      // given
      const raw = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;
      const parser = new InputParser(raw);

      // when
      const parsed = parser.parseLines(parseMatrix).getParsed();
      const parsedAsString = mapMatrixToString(parsed);

      // then
      assertEquals(parsedAsString, raw);
    });
  });

  describe("when parsing the input to matrix", () => {
    test("should be able to convert to matrix of target type if specified", () => {
      // given
      const raw = `1234
4321`;
      const parser = new InputParser(raw);

      // when
      const parseToIntMatrix = (input: string) =>
        parseMatrix(input, -1, (char) => parseInt(char));
      const parsed = parser.parseLines(parseToIntMatrix).getParsed();
      const parsedAsString = mapMatrixToString(parsed);

      // then
      assertEquals(parsed, [
        [1, 2, 3, 4],
        [4, 3, 2, 1],
      ]);
      assertEquals(parsedAsString, raw);
    });
  });
});
