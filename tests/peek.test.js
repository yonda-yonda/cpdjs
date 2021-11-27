const {
  find,
  quartile
} = require("../dist/peek.js");

it("find", () => {
  expect(find([
    1, 2, 4, 2, 2, 3, 1
  ])).toEqual([
    false, false, true, false, false, true, false
  ]);
  expect(find([
    1, 2, 4, 2, 2, 3, 1
  ], {
    neighbor: 3
  })).toEqual([
    false, false, true, false, false, false, false
  ]);
  expect(find([
    1, 2, 4, 2, 2, 1, 3
  ])).toEqual([
    false, false, true, false, false, false, false
  ]);
  expect(find([
    4, 4, 4, 2, 2, 1, 3
  ])).toEqual([
    false, false, false, false, false, false, false
  ]);
  expect(find([
    1, 4, 4, 2, 2, 1, 3
  ], {
    neighbor: 2
  })).toEqual([
    false, true, true, false, false, false, false
  ]);
  expect(find([
    1, 2, 4, 2, undefined, 3, 1
  ])).toEqual([
    false, false, true, false, false, false, false
  ]);
  expect(find([
    1, 2, 4, 2, undefined, 3, 1
  ], {
    neighbor: 2
  })).toEqual([
    false, false, true, false, false, true, false
  ]);
  expect(find([
    undefined, 2, 4, 2, 2, 3, undefined
  ])).toEqual([
    false, false, true, false, false, false, false
  ]);
  expect(find([
    1, 2, 4, 2, 2, 3, 1
  ], {
    threshold: 3.5
  })).toEqual([
    false, false, true, false, false, false, false
  ]);
});

it("quartile", () => {
  expect(quartile([
    2.2, 2.8, 3.0, 3.4, 3.5, 3.8, 4.0, 4.2, 4.2, 4.7, 5.5
  ])).toEqual({
    "first": 3,
    "iqr": 1.2000000000000002,
    "max": 5.5,
    "min": 2.2,
    "second": 3.8,
    "third": 4.2
  });

  expect(quartile([
    2.2, 2.8, 3.0, 3.4, 3.5, 3.8, 4.0, 4.2, 4.2, 4.6, 4.7, 5.5
  ])).toEqual({
    "first": 3.2,
    "iqr": 1.2000000000000002,
    "max": 5.5,
    "min": 2.2,
    "second": 3.9,
    "third": 4.4
  });

  expect(quartile([
    3.5, 2.8, 4.2, 3.0, 3.4, 5.5, 3.8, 2.2, 4.0, 4.2, 4.7
  ])).toEqual({
    "first": 3,
    "iqr": 1.2000000000000002,
    "max": 5.5,
    "min": 2.2,
    "second": 3.8,
    "third": 4.2
  });

  expect(quartile([
    4.6, 3.5, 2.8, 4.2, 3.0, 3.4, 5.5, 3.8, 2.2, 4.0, 4.2, 4.7
  ])).toEqual({
    "first": 3.2,
    "iqr": 1.2000000000000002,
    "max": 5.5,
    "min": 2.2,
    "second": 3.9,
    "third": 4.4
  });

});