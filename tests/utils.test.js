const {
  vZeros,
  mZeros,
  identity,
  copy,
  mult,
  transpose,
  indexOrder,
  embed,
} = require("../dist/utils.js");
const {
  InvalidArgumentError
} = require("../dist/errors.js");

it("zeros", () => {
  expect(vZeros(3)).toEqual([0, 0, 0]);
  expect(mZeros(2, 3)).toEqual([
    [0, 0, 0],
    [0, 0, 0]
  ]);
});

it("identity", () => {
  expect(identity(2, 3)).toEqual([
    [1, 0, 0],
    [0, 1, 0]
  ]);
  expect(identity(3)).toEqual([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]);
});

it("copy", () => {
  const target = identity(2, 3);
  expect(copy(target)).toEqual(target);
});


it("mult", () => {
  expect(mult([
    [0, 1],
    [2, 3],
    [4, 5]
  ], [
    [0, 1, 2, 3],
    [4, 5, 6, 7]
  ])).toEqual(
    [
      [4, 5, 6, 7],
      [12, 17, 22, 27],
      [20, 29, 38, 47]
    ]
  )
});

it("transpose", () => {
  expect(transpose([
    [0, 1],
    [2, 3],
    [4, 5]
  ])).toEqual(
    [
      [0, 2, 4],
      [1, 3, 5]
    ]
  )
});

it("indexOrder", () => {
  expect(indexOrder([2, 5, 1, 3, 0])).toEqual([{
    "index": 1,
    "value": 5
  }, {
    "index": 3,
    "value": 3
  }, {
    "index": 0,
    "value": 2
  }, {
    "index": 2,
    "value": 1
  }, {
    "index": 4,
    "value": 0
  }]);
});

it("embed", () => {
  const x = Array.from({
    length: 30
  }, (_, k) => k);

  const window = 5;
  const k = 3;
  expect(embed(x, window + k - 1, window, k)).toEqual([
    [0, 1, 2],
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 6]
  ]);
  expect(embed(x, x.length, window, k)).toEqual([
    [23, 24, 25],
    [24, 25, 26],
    [25, 26, 27],
    [26, 27, 28],
    [27, 28, 29]
  ]);

  expect(() => {
    embed(x, 0, window, k)
  }).toThrow(InvalidArgumentError);

  expect(() => {
    embed(x, x.length + 1, window, k)
  }).toThrow(InvalidArgumentError);
});