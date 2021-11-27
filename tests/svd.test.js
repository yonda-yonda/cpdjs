const {
  svd
} = require("../dist/svd.js");
const {
  transpose,
  mult,
  identity
} = require("../dist/utils.js");

function flatDeep(arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), []) :
    arr.slice();
};

function equal(a, b, eps = 1e-8) {
  const af = flatDeep(a, Infinity);
  const bf = flatDeep(b, Infinity);
  if (af.length !== bf.length) return false;

  for (let i = 0; i < af.length; i++) {
    if (Math.abs(af[i] - bf[i]) >= eps) return false;
  }
  return true
}

it("svd", () => {
  expect(svd([
    [1, 2, -1],
    [2.3, 4, 4],
    [-2, 5.1, 1],
    [0, 0.8, 6]
  ])).toEqual([
    [8.6574334885991, 3.035734412413041, 5.1742788838420815],
    [
      [-0.07072234958732171, -0.44339051343577485, 0.3774019821004604],
      [-0.6709904988379602, -0.6191624817050242, 0.02110770312772773],
      [-0.44842241801354255, 0.5516394244955363, 0.7004103243598975],
      [-0.5862486117347502, 0.34020085124271693, -0.6054317354627018]
    ],
    [
      [-0.08283698186442445, -0.97859122925942, -0.18840711359216186],
      [-0.6446898983553723, -0.09154595561254414, 0.7589428654184223],
      [-0.7599427408654761, 0.18433269928996016, -0.6233044894578769]
    ]
  ]);
  expect(svd([
    [22, 10, 2, 3, 7],
    [14, 7, 10, 0, 8],
    [-1, 13, -1, -11, 3],
    [-3, -2, 13, -2, 4],
    [9, 8, 1, -2, 4],
    [9, 1, -7, 5, -1],
    [2, -6, 6, 5, 1],
    [4, 5, 0, -2, 2]
  ])).toEqual([
    [35.32704346531138, 9.573940498701413e-16, 20, 19.595917942265423, 1.06542186658539e-15],
    [
      [-0.7071067811865477, 0.24941078552843737, -0.1581138830084212, 0.17677669529663484, 0.46249012305871157],
      [-0.5303300858899109, 0.15561846679158467, -0.1581138830084144, -0.3535533905932758, -0.4984241945584841],
      [-0.1767766952966369, -0.15463850863346562, 0.7905694150420975, -0.17677669529662737, 0.39672392505197773],
      [-1.535188302349435e-17, -0.327659344158142, -0.15811388300840995, -0.7071067811865496, 0.10002122333785726],
      [-0.3535533905932738, -0.07264908221434106, 0.15811388300841908, 2.018730235059385e-15, -0.20840183404019963],
      [-0.17677669529663695, -0.5725566013276189, -0.15811388300842588, 0.5303300858899087, -0.05555150976965302],
      [-7.436106978043474e-18, -0.3142200667715553, -0.4743416490252549, -0.1767766952966428, 0.49587516446331287],
      [-0.17677669529663695, -0.5920052680987367, 0.15811388300841905, 1.9666343206714565e-15, -0.2790566557613189]
    ],
    [
      [-0.8006407690254358, -0.4190954851117173, -0.3162277660168415, 0.2886751345948089, 0],
      [-0.4803844614152614, 0.44050912303713363, 0.6324555320336758, 8.026771732345407e-15, 0.4185480638490933],
      [-0.16012815380508713, -0.05200454924743929, -0.31622776601682695, -0.8660254037844426, 0.34879005320757783],
      [1.5612511283791264e-17, 0.6760591402167118, -0.6324555320336795, 0.28867513459480515, 0.24415303724530432],
      [-0.3202563076101744, 0.41297730284731266, 3.687566194442832e-15, -0.2886751345948129, -0.8022171223774289]
    ]
  ]);

  const A = [
    [1, 2, 3],
    [6, 4, 5],
    [8, 9, 7],
    [10, 11, 12]
  ];

  const [q, U, V] = svd(A);
  const Q = identity(q.length);
  for (let i = 0; i < q.length; i++) {
    Q[i][i] = q[i];
  }
  expect(svd(A)).toEqual([
    [25.34681451331189, 2.1487937783927653, 1.7092920539517635],
    [
      [-0.13801181521017514, -0.6164668391139874, 0.05282550533319081],
      [-0.34036965064175917, 0.3702766072568166, -0.8142061075106706],
      [-0.5462591926353001, 0.5354259596480477, 0.5751589229627636],
      [-0.7527962103025155, -0.4429254024394594, -0.05890750219563735]
    ],
    [
      [-0.5554254305121666, 0.6791468180386532, -0.47985642716165317],
      [-0.5852646008926206, 0.09066805886947094, 0.8057571905002423],
      [-0.5907350828267913, -0.7283810147503947, -0.347121245775607]
    ]
  ]);
  expect(equal(A, mult(mult(U, Q), transpose(V)))).toBeTruthy();

  for (let i = 0; i < q.length; i++) {
    const qUi = [];
    const Vi = [];
    for (let row = 0; row < U.length; row++) {
      qUi.push([q[i] * U[row][i]])
    }
    for (let row = 0; row < V.length; row++) {
      Vi.push([V[row][i]])
    }
    // A * Vi = q[i] * Ui
    expect(equal(mult(A, Vi), qUi)).toBeTruthy();
  }

  // m < n
  const At = transpose(A);
  const [qt, Ut, Vt] = svd(At);
  const Qt = identity(qt.length);
  for (let i = 0; i < qt.length; i++) {
    Qt[i][i] = qt[i];
  }
  expect(equal(At, mult(mult(Ut, Qt), transpose(Vt)))).toBeTruthy();
  expect(equal(U, Vt)).toBeTruthy();
  expect(equal(V, Ut)).toBeTruthy();
});