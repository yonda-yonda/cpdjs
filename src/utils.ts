import { InvalidArgumentError } from "./errors";

export const vZeros = (m: number): number[] => {
    if (m < 1) {
        throw new InvalidArgumentError("m must be more than 0.");
    }
    return (Array(m) as number[]).fill(0);
}

export const mZeros = (row: number, col?: number): number[][] => {
    if (row < 1) {
        throw new InvalidArgumentError("row must be more than 0.");
    }
    if (col && col < 1) {
        throw new InvalidArgumentError("col must be more than 0.");
    }
    const m = row;
    const n = col ? col : row;

    const ret: number[][] = [];
    for (let i = 0; i < m; i++) {
        ret.push(vZeros(n));
    }
    return ret;
}

export const copy = (mat: number[][]): number[][] => {
    const m = mat.length;
    const ret = [];
    for (let i = 0; i < m; i++) {
        const row = [];
        const n = mat[i].length;
        for (let j = 0; j < n; j++) {
            row.push(mat[i][j]);
        }
        ret.push(row);
    }
    return ret;
}

export const transpose = (mat: number[][]): number[][] => {
    const ret: number[][] = [];
    const m = mat.length;
    const n = mat[0]?.length;

    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < m; j++) {
            row.push(mat[j][i]);
        }
        ret.push(row);
    }
    return ret;
}

export const mult = (mat1: number[][], mat2: number[][]): number[][] => {
    if (mat1[0]?.length !== mat2.length) {
        throw new InvalidArgumentError("Matrices don't match size.");
    }
    const ret: number[][] = [];

    for (let i = 0; i < mat1.length; i++) {
        const row = [];
        for (let j = 0; j < mat2[0].length; j++) {
            let elm = 0;
            for (let k = 0; k < mat1[0].length; k++) {
                elm += mat1[i][k] * mat2[k][j];
            }
            row.push(elm)
        }
        ret.push(row);
    }
    return ret;
}

export const identity = (row: number, col?: number): number[][] => {
    if (row < 1) {
        throw new InvalidArgumentError("row must be more than 0.");
    }
    if (col && col < 1) {
        throw new InvalidArgumentError("col must be more than 0.");
    }
    const m = row;
    const n = col ? col : row;
    const ret = [];
    for (let i = 0; i < m; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            if (j === i) row.push(1);
            else row.push(0);
        }
        ret.push(row);
    }
    return ret;
}

export const indexOrder = (arr: number[]): {
    value: number;
    index: number;
}[] => {
    const ret = arr.map((value, index) => {
        return {
            value,
            index
        }
    });
    ret.sort((a, b) => {
        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;
        return 0;
    });
    return ret
}

export const embed = (arr: number[], t: number, w: number, k: number): number[][] => {
    if (t - k - w + 1 < 0 || t > arr.length) {
        throw new InvalidArgumentError("out of range.");
    }

    const X = mZeros(w, k);
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < k; j++) {
            X[i][j] = arr[t - (k - j) - w + 1 + i]
        }
    }
    return X
}
