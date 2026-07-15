function lerp(a, b, t) { return a + (b - a) * t; }
function getSpForDist(d) {
  const eased = (580 - d) / (580 - 18);
  if (eased < 0.5) return Math.sqrt(eased / 2);
  return 1 - Math.sqrt(2 * (1 - eased)) / 2;
}

const dists = [40, 65, 92, 128, 175, 230, 290, 360];
dists.forEach(d => {
  const sp = getSpForDist(d);
  const eased = sp < 0.5 ? 2*sp*sp : -1+(4-2*sp)*sp;
  const rad = lerp(580, 18, eased);
  console.log(Dist: , sp: , radius check: );
});
