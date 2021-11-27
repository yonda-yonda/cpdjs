import { copy, vZeros, mZeros, transpose } from "./utils";
import { InvalidArgumentError, UnconvergencedError } from "./errors";


export interface SvdOptions {
    eps?: number;
    beta?: number;
    maxIter?: number;
}

export const svd = (A: number[][], options?: SvdOptions): [number[], number[][], number[][]] => {
    /*
        References
        ----------
        Singular Value Decomposition and Least Squares Solutions
        Numerische Mathematik volume 14, pages403–420 (1970)
        Auhtors: G. H. Golub, C. Reinsch
        https://people.duke.edu/~hpgavin/SystemID/References/Golub+Reinsch-NM-1970.pdf
    */
    const maxIter = options?.maxIter ? options.maxIter : 50;
    const beta = options?.beta ? options.beta : Number.MIN_VALUE;
    // beta is the smallest positive number representable in the computer.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE
    let eps = options?.eps ? options.eps : Number.EPSILON; // the machine precision

    const tol = beta / eps;

    let m = A.length;
    if (m < 1) {
        throw new InvalidArgumentError("row size must be more than 0.");
    }
    let n = A[0].length;
    if (n < 1) {
        throw new InvalidArgumentError("col size a must be more than 0.");
    }

    // if m < n, the algorithms may be applied to At
    // At = (U Q Vt)t = V Q Ut
    const portrait = m >= n;
    const U = portrait ? copy(A) : copy(transpose(A));
    if (!portrait) {
        [m, n] = [n, m];
    }

    const q = vZeros(n);
    const e = vZeros(n);
    const V = mZeros(n);

    // Householeder's reduction to bidiagonal form
    let g = 0, x = 0;
    for (let i = 0; i < n; i++) {
        e[i] = g;
        let s = 0;
        const l = i + 1;
        for (let j = i; j < m; j++) {
            s += U[j][i] ** 2;
        }
        if (s < tol) {
            g = 0;
        } else {
            const f = U[i][i];
            g = f < 0 ? Math.sqrt(s) : -Math.sqrt(s);
            const h = f * g - s;
            U[i][i] = f - g;
            for (let j = l; j < n; j++) {
                let s = 0;
                for (let k = i; k < m; k++) {
                    s += U[k][i] * U[k][j];
                }
                const f = s / h;
                for (let k = i; k < m; k++) {
                    U[k][j] += f * U[k][i];
                }
            }
        }
        q[i] = g;
        s = 0;
        for (let j = l; j < n; j++) {
            s += U[i][j] ** 2;
        }
        if (s < tol) { // When l >= n, s is always 0.
            g = 0;
        } else {
            const f = U[i][l];
            g = f < 0 ? Math.sqrt(s) : -Math.sqrt(s);
            const h = f * g - s;
            U[i][l] = f - g;
            for (let j = l; j < n; j++) {
                e[j] = U[i][j] / h;
            }
            for (let j = l; j < m; j++) {
                let s = 0;
                for (let k = l; k < n; k++) {
                    s += U[j][k] * U[i][k];
                }
                for (let k = l; k < n; k++) {
                    U[j][k] += s * e[k];
                }
            }
        }
        const y = Math.abs(q[i]) + Math.abs(e[i]);
        if (y > x) x = y;
    }
    // accumulation of right-hand transformations
    for (let i = n - 1; i >= 0; i--) {
        const l = i + 1;
        if (g !== 0) { // When i = n - 1, g is always 0.
            const h = U[i][l] * g;
            for (let j = l; j < n; j++) {
                V[j][i] = U[i][j] / h;
            }
            for (let j = l; j < n; j++) {
                let s = 0;
                for (let k = l; k < n; k++) {
                    s += U[i][k] * V[k][j];
                }
                for (let k = l; k < n; k++) {
                    V[k][j] += s * V[k][i];
                }
            }
        }
        for (let j = l; j < n; j++) {
            V[i][j] = 0;
            V[j][i] = 0;
        }
        V[i][i] = 1;
        g = e[i];
    }
    // accumulation of left-hand transformations
    for (let i = n - 1; i >= 0; i--) {
        const l = i + 1;
        g = q[i];
        for (let j = l; j < n; j++) {
            U[i][j] = 0;
        }
        if (g !== 0) {
            const h = U[i][i] * g;
            for (let j = l; j < n; j++) {
                let s = 0;
                for (let k = l; k < m; k++) {
                    s += U[k][i] * U[k][j];
                }
                const f = s / h;
                for (let k = i; k < m; k++) {
                    U[k][j] += f * U[k][i];
                }
            }

            for (let j = i; j < m; j++) {
                U[j][i] /= g;
            }
        } else {
            for (let j = i; j < m; j++) {
                U[j][i] = 0;
            }
        }
        U[i][i] += 1;
    }

    // diagonalization of bidiagonal form
    eps *= x;
    for (let k = n - 1; k >= 0; k--) {
        let z = Infinity;
        let cnt = 0
        while (++cnt) {
            // test f splitting
            let l, convergence = false;
            for (l = k; l >= 0; l--) {
                if (Math.abs(e[l]) <= eps) { // e[0] is always 0.
                    convergence = true;
                    break;
                }
                if (Math.abs(q[l - 1]) <= eps) {
                    break;
                }
            }
            // cancellation of e[l]
            if (!convergence) {
                let c = 0, s = 1;
                const l1 = l - 1; // alyways l1 >= 0
                for (let i = l; i <= k; i++) {
                    const f = s * e[i];
                    e[i] *= c;
                    if (Math.abs(f) <= eps)
                        break;
                    const g = q[i];
                    const h = Math.sqrt(f ** 2 + g ** 2);
                    q[i] = h;
                    c = g / h;
                    s = -f / h;

                    for (let j = 0; j < m; j++) {
                        const y = U[j][l1];
                        const z = U[j][i];
                        U[j][l1] = y * c + z * s;
                        U[j][i] = -y * s + z * c;
                    }
                }
            }
            // test f convergence
            z = q[k];
            if (l === k) break; // when k = 0, l is always 0.
            if (cnt >= maxIter) {
                throw new UnconvergencedError();
            }

            // shift from bottom 2*2 minor
            let x = q[l], g = e[k - 1];
            const y = q[k - 1], h = e[k];
            let f = ((y - z) * (y + z) + (g - h) * (g + h)) / (2 * h * y);
            g = Math.sqrt(f ** 2 + 1);
            f = ((x - z) * (x + z) + h * (y / (f < 0 ? (f - g) : (f + g)) - h)) / x;

            // next QR transformation
            let c = 1, s = 1;
            for (let i = l + 1; i <= k; i++) { // k <= n - 1, l >= 0
                let g = e[i], y = q[i], h = s * g;
                g *= c;
                let z = Math.sqrt(f ** 2 + h ** 2);
                e[i - 1] = z;
                c = f / z;
                s = h / z;
                f = x * c + g * s;
                g = -x * s + g * c;
                h = y * s;
                y *= c;
                for (let j = 0; j < n; j++) {
                    const x = V[j][i - 1];
                    const z = V[j][i];
                    V[j][i - 1] = x * c + z * s;
                    V[j][i] = -x * s + z * c;
                }
                z = Math.sqrt(f ** 2 + h ** 2);
                q[i - 1] = z;
                c = f / z;
                s = h / z;
                f = c * g + s * y;
                x = -s * g + c * y;
                for (let j = 0; j < m; j++) {
                    const y = U[j][i - 1];
                    const z = U[j][i];
                    U[j][i - 1] = y * c + z * s;
                    U[j][i] = -y * s + z * c;
                }
            }
            e[l] = 0;
            e[k] = f;
            q[k] = x;
        }

        if (z < 0) {
            // q[k] is made non-negative
            q[k] = -z;
            for (let j = 0; j < n; j++) {
                V[j][k] *= -1;
            }
        }
    }
    return portrait ? [q, U, V] : [q, V, U];
}

