import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { building, tasks, faults, maintenance } = body;

    // Varmistetaan, että taloyhtiön tiedot ovat mukana.
    if (!building) {
      return NextResponse.json(
        {
          error: "Taloyhtiön tietoja ei löytynyt.",
        },
        {
          status: 400,
        },
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
Olet suomalaisen taloyhtiön hallituksen päätöksenteon apuri.

Analysoi VAIN sinulle annettua taloyhtiötä ja siihen liittyvää dataa.

Älä yhdistä mukaan muiden taloyhtiöiden tietoja.
Älä keksi puuttuvia tietoja.
Älä tee oletuksia, joita annettu data ei tue.

Kirjoita vastaus suomeksi.

Tämä yhteenveto näytetään dashboardilla, joten pidä se erittäin tiiviinä.
Enimmäispituus noin 150 sanaa.

Käytä täsmälleen tätä rakennetta:

TILANNEKUVA
2–3 lyhyttä virkettä taloyhtiön nykytilanteesta.

HUOMIOTA VAATII
Enintään kolme tärkeintä asiaa.
Priorisoi:
- korkean prioriteetin vikailmoitukset
- myöhästyneet tai kiireelliset tehtävät
- lähestyvät kunnossapitotoimenpiteet

SUOSITUS
1–2 konkreettista seuraavaa toimenpidettä.

Jos kiireellisiä asioita ei ole, sano se lyhyesti.
Älä kirjoita pitkää yleistä analyysiä.
      `,

      input: `
TALOYHTIÖ:
${JSON.stringify(building, null, 2)}

AVOIMET TEHTÄVÄT:
${JSON.stringify(tasks || [], null, 2)}

AVOIMET VIKAILMOITUKSET:
${JSON.stringify(faults || [], null, 2)}

KUNNOSSAPITO:
${JSON.stringify(maintenance || [], null, 2)}
      `,
    });

    const summary = response.output_text?.trim();

    if (!summary) {
      return NextResponse.json(
        {
          error: "AI ei palauttanut yhteenvetoa.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      summary,
    });
  } catch (error) {
    console.error("AI-yhteenvedon luonti epäonnistui:", error);

    return NextResponse.json(
      {
        error: "AI-yhteenvedon luonti epäonnistui.",
      },
      {
        status: 500,
      },
    );
  }
}
