import type {SiteContent} from '@/lib/site-content';
type CalendarEntry=Pick<SiteContent['macro']['events'][number],'id'|'at'|'date'|'title'|'currency'|'impact'|'source'>;
export const verifiedEvents:CalendarEntry[]=[
  {
    "id": "bce-space-20261125",
    "date": "2026-11-25",
    "at": "2026-11-25T10:00:00Z",
    "title": "Hábitos de pagamento na zona do euro (SPACE)",
    "currency": "EUR",
    "impact": "Baixo",
    "source": {
      "label": "BCE",
      "url": "https://www.ecb.europa.eu/press/calendars/weekly/html/index.en.html"
    }
  },
  {
    "id": "bce-dwa-20261125",
    "date": "2026-11-25",
    "at": "2026-11-25T10:00:00Z",
    "title": "Distribuição da riqueza das famílias na zona do euro",
    "currency": "EUR",
    "impact": "Baixo",
    "source": {
      "label": "BCE",
      "url": "https://www.ecb.europa.eu/press/calendars/weekly/html/index.en.html"
    }
  },
  {
    "id": "bea-gdp-20261125",
    "date": "2026-11-25",
    "at": "2026-11-25T13:30:00Z",
    "title": "PIB dos EUA · 2ª estimativa do 3º trimestre e lucros empresariais",
    "currency": "USD",
    "impact": "Alto",
    "source": {
      "label": "BEA",
      "url": "https://www.bea.gov/news/schedule"
    }
  },
  {
    "id": "bea-pce-20261125",
    "date": "2026-11-25",
    "at": "2026-11-25T13:30:00Z",
    "title": "Renda, gastos pessoais e inflação PCE · outubro",
    "currency": "USD",
    "impact": "Alto",
    "source": {
      "label": "BEA",
      "url": "https://www.bea.gov/news/schedule"
    }
  },
  {
    "id": "census-durables-20261125",
    "date": "2026-11-25",
    "at": "2026-11-25T13:30:00Z",
    "title": "Pedidos de bens duráveis · prévia de outubro",
    "currency": "USD",
    "impact": "Moderado",
    "source": {
      "label": "U.S. Census Bureau",
      "url": "https://www.census.gov/economic-indicators/calendar-listview-2026.html"
    }
  },
  {
    "id": "dol-claims-20261125",
    "date": "2026-11-25",
    "at": "2026-11-25T13:30:00Z",
    "title": "Pedidos semanais de seguro-desemprego",
    "currency": "USD",
    "impact": "Moderado",
    "source": {
      "label": "Departamento do Trabalho dos EUA",
      "url": "https://oui.doleta.gov/unemploy/archive.asp"
    }
  },
  {
    "id": "census-homes-20261125",
    "date": "2026-11-25",
    "at": "2026-11-25T15:00:00Z",
    "title": "Vendas de casas novas · outubro",
    "currency": "USD",
    "impact": "Moderado",
    "source": {
      "label": "U.S. Census Bureau",
      "url": "https://www.census.gov/economic-indicators/calendar-listview-2026.html"
    }
  },
  {
    "id": "fed-beige-20261125",
    "date": "2026-11-25",
    "at": "2026-11-25T19:00:00Z",
    "title": "Livro Bege do Federal Reserve",
    "currency": "USD",
    "impact": "Moderado",
    "source": {
      "label": "Federal Reserve",
      "url": "https://www.federalreserve.gov/newsevents/2026-november.htm"
    }
  },
  {
    "id": "nim-confianca-20261126",
    "date": "2026-11-26",
    "at": "2026-11-26T07:00:00Z",
    "title": "Confiança do consumidor na Alemanha (GfK/NIM)",
    "currency": "EUR",
    "impact": "Moderado",
    "source": {
      "label": "Nürnberg Institut für Marktentscheidungen (NIM)",
      "url": "https://www.nim.org/en/consumer-climate"
    }
  },
  {
    "id": "bce-moeda-20261126",
    "date": "2026-11-26",
    "at": "2026-11-26T09:00:00Z",
    "title": "Evolução da moeda e do crédito na zona do euro",
    "currency": "EUR",
    "impact": "Moderado",
    "source": {
      "label": "Banco Central Europeu",
      "url": "https://www.ecb.europa.eu/press/calendars/weekly/html/index.en.html"
    }
  },
  {
    "id": "bce-lagarde-cupula-20261126",
    "date": "2026-11-26",
    "at": "2026-11-26T09:00:00Z",
    "title": "Participação de Christine Lagarde na Cúpula do Euro",
    "currency": "EUR",
    "impact": "Baixo",
    "source": {
      "label": "Banco Central Europeu",
      "url": "https://www.ecb.europa.eu/press/calendars/weekly/html/index.en.html"
    }
  },
  {
    "id": "bce-ata-20261126",
    "date": "2026-11-26",
    "at": "2026-11-26T12:30:00Z",
    "title": "Ata da reunião de política monetária do BCE de 28–29 de outubro",
    "currency": "EUR",
    "impact": "Alto",
    "source": {
      "label": "Banco Central Europeu",
      "url": "https://www.ecb.europa.eu/press/calendars/weekly/html/index.en.html"
    }
  },
  {
    "id": "fr-ipc-20261127",
    "date": "2026-11-27",
    "at": "2026-11-27T07:45:00Z",
    "title": "Inflação ao consumidor na França · prévia de novembro",
    "currency": "EUR",
    "impact": "Moderado",
    "source": {
      "label": "Insee",
      "url": "https://www.insee.fr/en/statistiques/9107975"
    }
  },
  {
    "id": "fr-pib-20261127",
    "date": "2026-11-27",
    "at": "2026-11-27T07:45:00Z",
    "title": "PIB da França · dados detalhados do 3º trimestre",
    "currency": "EUR",
    "impact": "Moderado",
    "source": {
      "label": "Insee",
      "url": "https://www.insee.fr/en/statistiques/9040046"
    }
  },
  {
    "id": "fr-consumo-20261127",
    "date": "2026-11-27",
    "at": "2026-11-27T07:45:00Z",
    "title": "Consumo de bens das famílias na França · outubro",
    "currency": "EUR",
    "impact": "Moderado",
    "source": {
      "label": "Insee",
      "url": "https://www.insee.fr/en/statistiques/9112025"
    }
  },
  {
    "id": "fr-emprego-20261127",
    "date": "2026-11-27",
    "at": "2026-11-27T07:45:00Z",
    "title": "Emprego na França · dados detalhados do 3º trimestre",
    "currency": "EUR",
    "impact": "Baixo",
    "source": {
      "label": "Insee",
      "url": "https://www.insee.fr/en/statistiques/8999412"
    }
  },
  {
    "id": "es-ipc-20261127",
    "date": "2026-11-27",
    "at": "2026-11-27T08:00:00Z",
    "title": "Inflação ao consumidor na Espanha · prévia de novembro",
    "currency": "EUR",
    "impact": "Moderado",
    "source": {
      "label": "INE",
      "url": "https://ine.es/daco/daco41/calen_semanal.pdf"
    }
  },
  {
    "id": "es-varejo-20261127",
    "date": "2026-11-27",
    "at": "2026-11-27T08:00:00Z",
    "title": "Vendas no varejo da Espanha · outubro",
    "currency": "EUR",
    "impact": "Moderado",
    "source": {
      "label": "INE",
      "url": "https://ine.es/daco/daco41/calen_semanal.pdf"
    }
  },
  {
    "id": "bce-ces-20261127",
    "date": "2026-11-27",
    "at": "2026-11-27T09:00:00Z",
    "title": "Expectativas dos consumidores na zona do euro · outubro",
    "currency": "EUR",
    "impact": "Moderado",
    "source": {
      "label": "BCE",
      "url": "https://www.ecb.europa.eu/press/calendars/weekly/html/index.en.html"
    }
  },
  {
    "id": "fed-cp-20261127",
    "date": "2026-11-27",
    "at": "2026-11-27T18:00:00Z",
    "title": "Juros dos títulos de curto prazo de empresas nos EUA",
    "currency": "USD",
    "impact": "Baixo",
    "source": {
      "label": "Federal Reserve",
      "url": "https://www.federalreserve.gov/newsevents/2026-november.htm"
    }
  },
  {
    "id": "fed-h15-20261127",
    "date": "2026-11-27",
    "at": "2026-11-27T21:15:00Z",
    "title": "Taxas de juros de referência nos EUA (H.15)",
    "currency": "USD",
    "impact": "Baixo",
    "source": {
      "label": "Federal Reserve",
      "url": "https://www.federalreserve.gov/newsevents/2026-november.htm"
    }
  },
  {
    "id": "fed-h8-20261127",
    "date": "2026-11-27",
    "at": "2026-11-27T21:15:00Z",
    "title": "Ativos e passivos dos bancos comerciais dos EUA (H.8)",
    "currency": "USD",
    "impact": "Baixo",
    "source": {
      "label": "Federal Reserve",
      "url": "https://www.federalreserve.gov/newsevents/2026-november.htm"
    }
  },
  {
    "id": "fed-h41-20261127",
    "date": "2026-11-27",
    "at": "2026-11-27T21:30:00Z",
    "title": "Balanço do Federal Reserve e reservas bancárias (H.4.1)",
    "currency": "USD",
    "impact": "Baixo",
    "source": {
      "label": "Federal Reserve",
      "url": "https://www.federalreserve.gov/newsevents/2026-november.htm"
    }
  }
];
