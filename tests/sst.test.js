const {
  score,
  embed,
  recomposition
} = require("../dist/sst.js");

const fs = require("fs");

it("recomposition", () => {
  expect(recomposition(
    [
      [
        1, 10, 100, 1000
      ],
      [
        2, 20, 200, 2000
      ],
      [
        3, 30, 300, 3000
      ]
    ],
    [3, 0, 2]
  )).toEqual([
    [1000, 1, 100],
    [2000, 2, 200],
    [3000, 3, 300]
  ]);
});

it("score1", () => {
  const data = fs.readFileSync("tests/test1.csv", 'utf-8');
  const ret = score(data.split("\n").map((v) => {
    return Number(v)
  }), 20, {
    lag: 10,
    trajectory: {
      k: 10
    },
    test: {
      k: 10
    }
  });
  const expected = fs.readFileSync("tests/expect1.csv", 'utf-8');
  expect(ret).toEqual(expected.split("\n").map((v, i) => {
    return v === "" ? undefined : Number(v)
  }));
});

it("score2", () => {
  const data = fs.readFileSync("tests/test2.csv", 'utf-8');
  const ret = score(data.split("\n").map((v) => {
    return Number(v)
  }), 10, {
    lag: 5,
    trajectory: {
      k: 10
    },
    test: {
      k: 10
    }
  });
  const expected = fs.readFileSync("tests/expect2.csv", 'utf-8');
  expect(ret).toEqual(expected.split("\n").map((v, i) => {
    return v === "" ? undefined : Number(v)
  }));
});