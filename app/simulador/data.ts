export type BallotOption = {
  id: string;
  name: string;
  party: string;
  shortParty?: string;
  list?: number;
  option?: number;
  image?: string;
  color?: "red" | "blue" | "green" | "neutral";
  featured?: boolean;
  blank?: boolean;
};

// Datos y retratos de Piribebuy extraídos del paquete de demostración entregado.
// La interfaz de votación y sus interacciones están implementadas por separado.

export const intendants: BallotOption[] = [
  {
    "id": "283.1872",
    "name": "ENMANUEL GINI",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": undefined,
    "image": "/simulador/candidatos/283.1872.webp",
    "color": "red",
    "featured": false
  },
  {
    "id": "284.1873",
    "name": "HECTOR BERNAL",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": undefined,
    "image": "/simulador/candidatos/284.1873.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "int-blank",
    "name": "VOTO EN BLANCO",
    "party": "",
    "color": "neutral",
    "blank": true
  }
];

export const partyLists: BallotOption[] = [
  {
    "id": "party-1",
    "name": "PARTIDO COLORADO",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "color": "red"
  },
  {
    "id": "party-2",
    "name": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "color": "blue"
  },
  {
    "id": "party-3",
    "name": "ALIANZA UNIDOS POR PIRIBEBUY",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "color": "green"
  }
];

export const candidates: BallotOption[] = [
  {
    "id": "285.1874",
    "name": "FREDY DOMINGUEZ",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": 1,
    "image": "/simulador/candidatos/285.1874.webp",
    "color": "red",
    "featured": false
  },
  {
    "id": "285.1875",
    "name": "PETETE ORTEGA",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": 2,
    "image": "/simulador/candidatos/285.1875.webp",
    "color": "red",
    "featured": false
  },
  {
    "id": "285.1876",
    "name": "JUANCITO ZALAZAR",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": 3,
    "image": "/simulador/candidatos/285.1876.webp",
    "color": "red",
    "featured": true
  },
  {
    "id": "285.1877",
    "name": "DAVID BOGADO",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": 4,
    "image": "/simulador/candidatos/285.1877.webp",
    "color": "red",
    "featured": false
  },
  {
    "id": "285.1878",
    "name": "LIC NIKI CACERES",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": 5,
    "image": "/simulador/candidatos/285.1878.webp",
    "color": "red",
    "featured": false
  },
  {
    "id": "285.1879",
    "name": "JORGE PEÑA",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": 6,
    "image": "/simulador/candidatos/285.1879.webp",
    "color": "red",
    "featured": false
  },
  {
    "id": "285.1880",
    "name": "JORGE JARA",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": 7,
    "image": "/simulador/candidatos/285.1880.webp",
    "color": "red",
    "featured": false
  },
  {
    "id": "285.1881",
    "name": "LIC. MIGUEL BENITEZ",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": 8,
    "image": "/simulador/candidatos/285.1881.webp",
    "color": "red",
    "featured": false
  },
  {
    "id": "285.1882",
    "name": "CECILIA RIVAS DE ORREGO",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": 9,
    "image": "/simulador/candidatos/285.1882.webp",
    "color": "red",
    "featured": false
  },
  {
    "id": "285.1883",
    "name": "PABLITO NUÑEZ",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": 10,
    "image": "/simulador/candidatos/285.1883.webp",
    "color": "red",
    "featured": false
  },
  {
    "id": "285.1884",
    "name": "ABG. LIZA BENITEZ",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": 11,
    "image": "/simulador/candidatos/285.1884.webp",
    "color": "red",
    "featured": false
  },
  {
    "id": "285.1885",
    "name": "JUAN CAÑETE",
    "party": "PARTIDO COLORADO",
    "shortParty": "ANR",
    "list": 1,
    "option": 12,
    "image": "/simulador/candidatos/285.1885.webp",
    "color": "red",
    "featured": false
  },
  {
    "id": "286.1886",
    "name": "OVIDIO GODOY",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": 1,
    "image": "/simulador/candidatos/286.1886.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "286.1887",
    "name": "ARNALDO OJEDA",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": 2,
    "image": "/simulador/candidatos/286.1887.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "286.1888",
    "name": "MARCOS AREVALOS RIVAS",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": 3,
    "image": "/simulador/candidatos/286.1888.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "286.1889",
    "name": "ROCIO MARIN",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": 4,
    "image": "/simulador/candidatos/286.1889.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "286.1890",
    "name": "RODRIGO CONTRERAS",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": 5,
    "image": "/simulador/candidatos/286.1890.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "286.1891",
    "name": "DIEGO ROJAS",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": 6,
    "image": "/simulador/candidatos/286.1891.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "286.1892",
    "name": "RAUL VALENZUELA",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": 7,
    "image": "/simulador/candidatos/286.1892.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "286.1893",
    "name": "MARGARITA GINI",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": 8,
    "image": "/simulador/candidatos/286.1893.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "286.1894",
    "name": "ANTONIO AREVALOS",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": 9,
    "image": "/simulador/candidatos/286.1894.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "286.1895",
    "name": "EVER FLEITAS",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": 10,
    "image": "/simulador/candidatos/286.1895.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "286.1896",
    "name": "JOSE LESME",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": 11,
    "image": "/simulador/candidatos/286.1896.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "286.1897",
    "name": "ING. TOMAS CABRERA",
    "party": "PARTIDO LIBERAL RADICAL AUTENTICO",
    "shortParty": "PLRA",
    "list": 2,
    "option": 12,
    "image": "/simulador/candidatos/286.1897.webp",
    "color": "blue",
    "featured": false
  },
  {
    "id": "287.1898",
    "name": "JOSE ALBERTO GONZALEZ PEREIRA",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "option": 1,
    "image": "/simulador/candidatos/287.1898.webp",
    "color": "green",
    "featured": false
  },
  {
    "id": "287.1899",
    "name": "DIGNA CAROLINA LOVERA",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "option": 2,
    "image": "/simulador/candidatos/287.1899.webp",
    "color": "green",
    "featured": false
  },
  {
    "id": "287.1900",
    "name": "LUIS SANTO SOSA BARRIOS",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "option": 3,
    "image": "/simulador/candidatos/287.1900.webp",
    "color": "green",
    "featured": false
  },
  {
    "id": "287.1901",
    "name": "HERMINIO RIVAS LOPEZ",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "option": 4,
    "image": "/simulador/candidatos/287.1901.webp",
    "color": "green",
    "featured": false
  },
  {
    "id": "287.1902",
    "name": "MIGUEL ANGEL OCAMPOS VELAZQUEZ",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "option": 5,
    "image": "/simulador/candidatos/287.1902.webp",
    "color": "green",
    "featured": false
  },
  {
    "id": "287.1903",
    "name": "AMADO ALEXANDER GONZALEZ",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "option": 6,
    "image": "/simulador/candidatos/287.1903.webp",
    "color": "green",
    "featured": false
  },
  {
    "id": "287.1904",
    "name": "ANGELINA BENITEZ RIOS",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "option": 7,
    "image": "/simulador/candidatos/287.1904.webp",
    "color": "green",
    "featured": false
  },
  {
    "id": "287.1905",
    "name": "CESAR OTAZU MELGAREJO",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "option": 8,
    "image": "/simulador/candidatos/287.1905.webp",
    "color": "green",
    "featured": false
  },
  {
    "id": "287.1906",
    "name": "MARTA GRACIELA SIANI DE GONZALEZ",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "option": 9,
    "image": "/simulador/candidatos/287.1906.webp",
    "color": "green",
    "featured": false
  },
  {
    "id": "287.1907",
    "name": "LAIS ANALIA GONZALEZ SIANI",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "option": 10,
    "image": "/simulador/candidatos/287.1907.webp",
    "color": "green",
    "featured": false
  },
  {
    "id": "287.1908",
    "name": "ALEXANDER ISMAEL GONZALEZ SIANI",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "option": 11,
    "image": "/simulador/candidatos/287.1908.webp",
    "color": "green",
    "featured": false
  },
  {
    "id": "287.1909",
    "name": "ROBERTO OSCAR CUETO BENITEZ",
    "party": "ALIANZA UNIDOS POR PIRIBEBUY",
    "shortParty": "UPP",
    "list": 3,
    "option": 12,
    "image": "/simulador/candidatos/287.1909.webp",
    "color": "green",
    "featured": false
  }
];

export const candidatesByList: Record<number, BallotOption[]> = {
  1: candidates.filter(item => item.list === 1),
  2: candidates.filter(item => item.list === 2),
  3: candidates.filter(item => item.list === 3),
};

export const blankCouncil: BallotOption = { id: "c-blank", name: "VOTO EN BLANCO", party: "JUNTA MUNICIPAL", color: "neutral", blank: true };
export const allCandidates = [...candidates, blankCouncil];
