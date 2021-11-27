import { indexOrder } from "./utils";
import { InvalidArgumentError } from "./errors";

export interface PeekFind {
  neighbor?: number;
  threshold?: number;
}


export const find = (values: (number | undefined)[], options?: PeekFind): boolean[] => {
  const neighbor = options?.neighbor ? (options.neighbor > values.length ? values.length : options.neighbor) : 1;
  const threshold = typeof options?.threshold === "undefined" ? -Infinity : options.threshold;

  if (neighbor < 1) {
    throw new InvalidArgumentError("neighbor is must be more than 0.");
  }
  const ret: boolean[] = [];
  for (let i = 0; i < values.length; i++) {
    if (typeof values[i] !== "undefined" && values[i] as number >= threshold) {
      let peek = true;
      let leftDrop = false, rightDrop = false;
      const center = values[i] as number;

      for (let j = 1; j <= neighbor; j++) {
        if (typeof values[i + j] !== "undefined") {
          const right = values[i + j] as number;
          if (!rightDrop) {
            if (right > center) {
              peek = false;
              break;
            }
            if (right < center) {
              rightDrop = true;
            }
          } else {
            if (right >= center) {
              peek = false;
              break;
            }
          }
        }
        if (typeof values[i - j] !== "undefined") {
          const left = values[i - j] as number;
          if (!leftDrop) {
            if (left > center) {
              peek = false;
              break;
            }
            if (left < center) {
              leftDrop = true;
            }
          } else {
            if (left >= center) {
              peek = false;
              break;
            }
          }
        }
      }
      ret.push(rightDrop && leftDrop && peek);
    } else {
      ret.push(false);
    }
  }
  return ret;
}

export const quartile = (values: (number | undefined)[]): {
  min: number;
  max: number;
  first: number;
  second: number;
  third: number;
  iqr: number;
} => {
  const orders = (values.filter((v) => typeof v !== "undefined") as number[]).sort((a, b) => {
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
  });

  if (orders.length < 1) {
    throw new InvalidArgumentError("values must contain at least one number.");
  }

  const max = orders[0];
  const min = orders[orders.length - 1];

  const largeStart = 0, smallEnd = orders.length - 1;
  let second, third, first, largeEnd, smallStart;
  if (orders.length % 2 !== 0) {
    const center = Math.floor(orders.length / 2);
    second = orders[center];
    largeEnd = center - 1;
    smallStart = center + 1;
  } else {
    largeEnd = orders.length / 2 - 1;
    smallStart = orders.length / 2;
    second = (orders[largeEnd] + orders[smallStart]) / 2;
  }

  const largeLength = largeEnd - largeStart + 1;
  if (largeLength % 2 !== 0) {
    third = orders[Math.floor(largeLength / 2)];
  } else {
    third = (orders[largeLength / 2 - 1] + orders[largeLength / 2]) / 2;
  }
  const smallLength = smallEnd - smallStart + 1;
  if (smallLength % 2 !== 0) {
    first = orders[smallStart + Math.floor(smallLength / 2)];
  } else {
    first = (orders[smallStart + smallLength / 2 - 1] + orders[smallStart + smallLength / 2]) / 2;
  }

  return {
    min,
    max,
    first,
    second,
    third,
    iqr: third - first
  }
}