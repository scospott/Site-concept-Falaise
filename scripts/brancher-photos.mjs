// Identification visuelle → optimisation (JPEG q82, largeur max 2000px)
// → rangement sous les noms cibles. Mapping établi à l'œil (voir PROGRESS).
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const G = "public/gallery";
const B = "bible";

const MAP = [
  // ESPACES
  [`${B}/3.png`, "public/espaces/verriere.jpg"],
  [`${G}/b8e7c8d5-0e3e-4337-8a31-145c9f6e1f29.png`, "public/espaces/bain-nordique.jpg"],
  [`${G}/1896d19d-80c8-49b7-84d7-bc92111fc8f1.png`, "public/espaces/suite-falaise.jpg"],
  [`${G}/abf86f57-39de-4b20-93b4-39f19654d736.png`, "public/espaces/cuisine.jpg"],
  [`${G}/0fe29842-2bb1-4c77-adf5-04b9b3b787b3.png`, "public/espaces/sentier.jpg"],
  [`${B}/4.png`, "public/espaces/piscine.jpg"],
  // GALERIE
  [`${B}/2.png`, "public/gallery/01-seuil.jpg"],
  [`${G}/a8fbe905-a104-47be-bea3-2734aefd2bfb.png`, "public/gallery/02-terrasse.jpg"],
  [`${G}/b6804183-c4fe-415e-a75a-188ba47ce991.png`, "public/gallery/03-matiere.jpg"],
  [`${G}/33d7b7ff-2781-4a18-81ee-2b23e4dfefb3.png`, "public/gallery/04-bain.jpg"],
  [`${G}/5ce1dae1-807a-41e2-8823-f6696e95a5bd.png`, "public/gallery/05-feu.jpg"],
  [`${G}/b1837c27-4947-4c74-842d-880eeb15f9ec.png`, "public/gallery/06-table.jpg"],
  [`${G}/78693f3a-ea21-470f-8081-8841f521c068.png`, "public/gallery/08-crique.jpg"],
  [`${G}/063c17c7-731f-4159-abe4-de2732796b85.png`, "public/gallery/09-villa-mer.jpg"],
];

mkdirSync("public/espaces", { recursive: true });
for (const [src, dest] of MAP) {
  const img = sharp(src);
  const meta = await img.metadata();
  await img
    .resize({ width: Math.min(meta.width ?? 2000, 2000), withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toFile(dest);
  const out = await sharp(dest).metadata();
  console.log(`✓ ${dest} ${out.width}×${out.height}`);
}

// og:image — keyframe cour recadrée 1200×630
await sharp(`${B}/k0-cour.png`)
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .jpeg({ quality: 85 })
  .toFile("public/og.jpg");
console.log("✓ public/og.jpg 1200×630 (keyframe cour)");
