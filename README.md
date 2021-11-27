# cpdjs

JavaScript Change Point Detection Library

## Singular Spectrum Transformation
変化点かどうかのスコアを計算する。

```Javascript
import { sst } from "cpd";
const result = sst.score([
    1,2,1,1,1,2,1,0,0,1,25,20,15,12,7,2,1,0,0,1,1,2,1,1,1,2,1,0,0,1
  ], 10, {
    lag: 2,
    trajectory: {
      size: 5,
      pattern: 2,
    },
    test: {
      size: 5,
      pattern: 2
    }
  });
```

## SVD
```Javascript
import { svd } from "cpd";
const [q, U, V] = svd.svd([
    [1, 2, -1],
    [2.3, 4, 4],
    [-2, 5.1, 1],
    [0, 0.8, 6]
  ])
```

`const [q, U, V] = svd(A)`

- q: A の特異値の配列
- U: 左直交行列
- Ui: 左特異ベクトル(左直交行列の i 列目)
- V: 右直交行列(列は右特異ベクトル)
- Vi: 右特異ベクトル(右直交行列の i 列目)

`A = U * Q * V^T`

`U^t * U = U * U^t = I`
`V^t * V = V * V^t = I`

`A * Vi = q[i] * Ui`
`A^t * Ui = q[i] * Vi`
