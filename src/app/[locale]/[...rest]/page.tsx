import { notFound } from "next/navigation";

// Toute URL sous une locale valide qui ne correspond à aucune route
// déclenche la page 404 stylée ([locale]/not-found.tsx).
export default function CatchAllPage() {
  notFound();
}
