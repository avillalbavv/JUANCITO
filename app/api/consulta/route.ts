type Voter = { nroreg: string; numero_ced: string; nombre: string; apellido: string; desc_sec: string; local: string; des_loc: string; mesa: string; orden: string };
const padronModules = import.meta.glob("/data/padron/*.json", { eager: true }) as Record<string, { default: Voter[] }>;
const voters = Object.values(padronModules).flatMap((module) => module.default);
const byDocument = new Map(voters.map((voter) => [voter.numero_ced.replace(/\D/g, ""), voter]));

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s+/g, " ").trim();
}
function maskDocument(value: string) {
  const clean = value.replace(/\D/g, "");
  return `${"•".repeat(Math.max(3, clean.length - 3))}${clean.slice(-3)}`;
}
function publicResult(voter: Voter) {
  const fullName = `${voter.nombre} ${voter.apellido}`.replace(/\s+/g, " ").trim();
  const mapQuery = encodeURIComponent(`${voter.des_loc}, Piribebuy, Paraguay`);
  return { id: voter.nroreg, fullName, maskedDocument: maskDocument(voter.numero_ced), pollingPlace: { code: voter.local, name: voter.des_loc, district: voter.desc_sec || "PIRIBEBUY" }, table: voter.mesa, orderNumber: voter.orden, mapsUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}` };
}

export async function POST(request: Request) {
  let body: { documentNumber?: unknown; fullName?: unknown };
  try { body = await request.json(); }
  catch { return Response.json({ message: "Solicitud inválida." }, { status: 400 }); }

  if (typeof body.documentNumber === "string") {
    const documentNumber = body.documentNumber.replace(/\D/g, "").slice(0, 9);
    if (documentNumber.length < 5) return Response.json({ message: "Cédula inválida." }, { status: 400 });
    const voter = byDocument.get(documentNumber);
    if (!voter) return Response.json({ message: "No encontramos esa cédula en el padrón de Piribebuy." }, { status: 404 });
    return Response.json({ results: [publicResult(voter)] });
  }
  if (typeof body.fullName === "string") {
    const query = normalize(body.fullName).slice(0, 80);
    if (query.length < 4) return Response.json({ message: "Nombre demasiado corto." }, { status: 400 });
    const terms = query.split(" ").filter(Boolean);
    const matches = voters.filter((voter) => { const name = normalize(`${voter.nombre} ${voter.apellido}`); return terms.every((term) => name.includes(term)); }).slice(0, 20).map(publicResult);
    if (!matches.length) return Response.json({ message: "No encontramos coincidencias en el padrón de Piribebuy." }, { status: 404 });
    return Response.json({ results: matches });
  }
  return Response.json({ message: "Ingresá una cédula o un nombre." }, { status: 400 });
}
