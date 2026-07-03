// Vérifie que three n'est chargé par AUCUN script du HTML initial :
// signature "WebGLRenderer"/"THREE.REVISION" cherchée dans le contenu.
const base = "http://localhost:3210";
const html = await (await fetch(base + "/")).text();
const srcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
console.log(`${srcs.length} scripts dans le HTML initial`);
let found = false;
for (const src of srcs) {
  const url = src.startsWith("http") ? src : base + src;
  const body = await (await fetch(url)).text();
  if (body.includes("WebGLRenderer") || body.includes("THREE.REVISION") || body.includes("react-three-fiber")) {
    console.log(`✗ three détecté dans le script initial : ${src.slice(0, 80)}`);
    found = true;
  }
}
console.log(found ? "ÉCHEC : three dans le First Load JS" : "✓ three ABSENT du First Load JS (chunk lazy séparé)");
// taille des scripts initiaux uniquement
let total = 0;
for (const src of srcs) {
  const url = src.startsWith("http") ? src : base + src;
  const buf = await (await fetch(url)).arrayBuffer();
  total += buf.byteLength;
}
console.log(`First Load JS (HTML initial, non gzip) : ${Math.round(total / 1024)} kB`);
