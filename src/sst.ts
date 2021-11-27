import { embed, transpose, mult, indexOrder } from "./utils";
import { svd, SvdOptions } from "./svd";
import { InvalidArgumentError } from "./errors";

export const recomposition = (mat: number[][], cols: number[]): number[][] => {
    const ret: number[][] = [];
    for (let i = 0; i < mat.length; i++) {
        const row: number[] = [];
        cols.forEach((j) => {
            row.push(mat[i][j])
        });
        ret.push(row);
    }
    return ret;
}

export interface SstOptions {
    lag?: number;
    trajectory?: {
        k?: number;
        m?: number;
    };
    test?: {
        k?: number;
        m?: number;
    };
    svd?: SvdOptions
}

export const score = (x: number[], window: number, options?: SstOptions): (number | undefined)[] => {
    /*
        References
        ----------
        入門 機械学習による異常検知
        https://www.coronasha.co.jp/np/isbn/9784339024913/
        異常検知と変化検知 (機械学習プロフェッショナルシリーズ)
        https://www.kspub.co.jp/book/detail/1529083.html
    */
    const T = x.length;
    const lag = options?.lag ? options.lag : Math.ceil(window / 2);
    const k1 = options?.trajectory?.k ? options.trajectory.k : Math.ceil(window / 2);
    const p1 = options?.trajectory?.m ? options.trajectory.m : Math.min(k1, 2);
    const k2 = options?.test?.k ? options.test.k : Math.ceil(window / 2);
    const p2 = options?.test?.m ? options.test.m : Math.min(k2, 2);

    if (lag < 1) {
        throw new InvalidArgumentError("lag is must be more than 0.");
    }
    if (k1 < 1) {
        throw new InvalidArgumentError("col of trajectory matrix is must be more than 0.");
    }
    if (k1 < p1) {
        throw new InvalidArgumentError("m of trajectory is must be less than col of trajectory.");
    }
    if (k2 < 1) {
        throw new InvalidArgumentError("col of test matrix is must be more than 0.");
    }
    if (k2 < p2) {
        throw new InvalidArgumentError("m of test is must be less than col of test.");
    }

    const start = window + k1 - 1;
    const end = T - lag;

    if (start > T - 1 || end < 0 || T + lag - k2 - window < 0) {
        throw new InvalidArgumentError("out of range.");
    }

    const ret: (number | undefined)[] = Array(T);

    for (let i = start; i <= end; i++) {
        const trajectory = embed(x, i, window, k1);
        const [q1, U1] = svd(trajectory);
        const order1 = indexOrder(q1);
        const test = embed(x, i + lag, window, k2);
        const [q2, U2] = svd(test);
        const order2 = indexOrder(q2);
        const X1 = recomposition(U1, order1.slice(0, p1).map((v) => {
            return v.index
        }));
        const X2 = recomposition(U2, order2.slice(0, p2).map((v) => {
            return v.index
        }));

        const [q] = svd(mult(transpose(X1), X2), options?.svd);
        const order = indexOrder(q);
        ret[i] = 1 - order[0].value ** 2;

    }

    return ret;
}

