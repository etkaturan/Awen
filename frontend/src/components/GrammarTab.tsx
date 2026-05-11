import { useState } from "react";
import "./GrammarTab.css";

const TOPICS = [
  {
    id: "cases",
    name: "Der/Die/Das Cases",
    content: {
      description: "The four German cases determine the role a noun plays in a sentence and change the article form.",
      tip: "Genitiv is common in formal writing. Practice 'wegen des Klimawandels' and 'trotz der Schwierigkeiten' for B2.",
      table: {
        headers: ["Case", "Role", "masc.", "fem.", "neut.", "plural"],
        rows: [
          ["Nominativ", "Subject", "der", "die", "das", "die"],
          ["Akkusativ", "Direct object", "den", "die", "das", "die"],
          ["Dativ", "Indirect object", "dem", "der", "dem", "den (+n)"],
          ["Genitiv", "Possession", "des (+s)", "der", "des (+s)", "der"],
        ],
        highlight: [0],
      },
      examples: [
        { de: "Der Klimawandel bedroht die Erde.", en: "Climate change threatens the Earth. (Nom → Akk)" },
        { de: "Wegen des Klimawandels leiden viele Tiere.", en: "Because of climate change, many animals suffer. (Gen)" },
        { de: "Die Regierung gibt dem Problem keine Priorität.", en: "The government gives the problem no priority. (Dat)" },
      ],
    },
  },
  {
    id: "konjunktiv",
    name: "Konjunktiv II",
    content: {
      description: "Konjunktiv II is used for hypothetical statements, polite requests, and indirect speech — essential for B2.",
      tip: "Use 'würde + Infinitiv' as a safe fallback when you forget the Konjunktiv II form.",
      table: {
        headers: ["Verb", "Konjunktiv II", "Example"],
        rows: [
          ["sein", "wäre", "Es wäre besser, wenn..."],
          ["haben", "hätte", "Ich hätte gerne mehr Zeit."],
          ["werden", "würde", "Ich würde mehr recyceln."],
          ["können", "könnte", "Das könnte helfen."],
          ["müssen", "müsste", "Man müsste handeln."],
        ],
        highlight: [1],
      },
      examples: [
        { de: "Wenn ich mehr Zeit hätte, würde ich mehr lesen.", en: "If I had more time, I would read more." },
        { de: "Es wäre besser, wenn wir sofort handeln würden.", en: "It would be better if we acted immediately." },
        { de: "Könnten Sie mir bitte helfen?", en: "Could you please help me?" },
      ],
    },
  },
  {
    id: "konnektoren",
    name: "Konnektoren",
    content: {
      description: "Connectors link sentences and show logical relationships. Varied connectors significantly improve your B2 score.",
      tip: "Avoid overusing 'weil'. Vary with 'da', 'denn', 'deshalb', 'daher', 'folglich', 'infolgedessen'.",
      table: {
        headers: ["Type", "Connector", "Meaning"],
        rows: [
          ["Reason", "weil / da / denn", "because / since"],
          ["Result", "deshalb / daher / folglich", "therefore / hence"],
          ["Contrast", "obwohl / trotzdem / jedoch", "although / nevertheless"],
          ["Addition", "außerdem / zudem / darüber hinaus", "furthermore / moreover"],
          ["Condition", "wenn / falls / sofern", "if / provided that"],
        ],
        highlight: [0],
      },
      examples: [
        { de: "Obwohl es schwierig ist, gebe ich nicht auf.", en: "Although it is difficult, I do not give up." },
        { de: "Deshalb müssen wir als Gesellschaft handeln.", en: "Therefore we must act as a society." },
        { de: "Darüber hinaus sollten wir erneuerbare Energien nutzen.", en: "Furthermore, we should use renewable energy." },
      ],
    },
  },
  {
    id: "passiv",
    name: "Passiv",
    content: {
      description: "The passive voice shifts focus from the subject to the action. Very common in formal German writing and B2 texts.",
      tip: "Vorgangspassiv (werden + Partizip II) describes an action. Zustandspassiv (sein + Partizip II) describes a result state.",
      table: {
        headers: ["Tense", "Structure", "Example"],
        rows: [
          ["Präsens", "wird + Partizip II", "Das Gesetz wird geändert."],
          ["Präteritum", "wurde + Partizip II", "Das Gesetz wurde geändert."],
          ["Perfekt", "ist + Partizip II + worden", "Das Gesetz ist geändert worden."],
          ["Zustand", "ist + Partizip II", "Das Gesetz ist geändert."],
        ],
        highlight: [0],
      },
      examples: [
        { de: "Das Gesetz wird von der Regierung geändert.", en: "The law is being changed by the government." },
        { de: "Die Maßnahmen wurden sofort umgesetzt.", en: "The measures were immediately implemented." },
      ],
    },
  },
  {
    id: "wortstellung",
    name: "Wortstellung",
    content: {
      description: "German word order follows strict rules. The verb is always in second position in main clauses, and at the end in subordinate clauses.",
      tip: "In subordinate clauses (weil, dass, obwohl), the conjugated verb goes to the very end — always.",
      table: {
        headers: ["Clause type", "Rule", "Example"],
        rows: [
          ["Main clause", "Verb in position 2", "Ich lerne jeden Tag Deutsch."],
          ["Inverted", "Verb still position 2", "Jeden Tag lerne ich Deutsch."],
          ["Subordinate", "Verb at the end", "..., weil ich Deutsch lerne."],
          ["Modal + inf.", "Modal end, inf. last", "..., weil ich Deutsch lernen muss."],
        ],
        highlight: [2],
      },
      examples: [
        { de: "Ich weiß, dass der Klimawandel ein Problem ist.", en: "I know that climate change is a problem." },
        { de: "Er sagt, er könne nicht kommen, weil er krank ist.", en: "He says he cannot come because he is sick." },
      ],
    },
  },
  {
    id: "genitiv",
    name: "Genitiv",
    content: {
      description: "The Genitiv shows possession or belonging. It is frequently used in formal German and B2 exam writing.",
      tip: "Common Genitiv prepositions: wegen, trotz, während, aufgrund, anstatt, innerhalb, außerhalb.",
      table: {
        headers: ["Preposition", "Meaning", "Example"],
        rows: [
          ["wegen", "because of", "wegen des Wetters"],
          ["trotz", "despite", "trotz der Schwierigkeiten"],
          ["während", "during", "während des Studiums"],
          ["aufgrund", "due to", "aufgrund der Ergebnisse"],
          ["innerhalb", "within", "innerhalb des Landes"],
        ],
        highlight: [0],
      },
      examples: [
        { de: "Wegen des schlechten Wetters blieben wir zu Hause.", en: "Because of the bad weather we stayed home." },
        { de: "Trotz der Schwierigkeiten hat er es geschafft.", en: "Despite the difficulties he managed it." },
      ],
    },
  },
];

export default function GrammarTab({ apiKey }: { apiKey: string }) {
  const [selected, setSelected] = useState(TOPICS[0]);
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const getAiExplanation = async () => {
    setLoadingAi(true);
    setAiExplanation("");
    try {
      const res = await fetch("http://127.0.0.1:8000/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Give me 2-3 practical B2 exam tips and a common mistake to avoid for the German grammar topic: ${selected.name}. Be concise and use examples.`,
            },
          ],
          api_key: apiKey,
        }),
      });
      const data = await res.json();
      setAiExplanation(data.response);
    } catch {
      setAiExplanation("Could not load AI explanation. Check your API key in Settings.");
    }
    setLoadingAi(false);
  };

  const c = selected.content;

  return (
    <div className="grammar-root">
      <div className="grammar-nav">
        <div className="grammar-nav-title">Topics</div>
        {TOPICS.map((t) => (
          <button
            key={t.id}
            className={`grammar-nav-item ${selected.id === t.id ? "active" : ""}`}
            onClick={() => { setSelected(t); setAiExplanation(""); }}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="grammar-content">
        <div className="grammar-heading">{selected.name}</div>
        <div className="grammar-desc">{c.description}</div>

        <div className="tip-box">💡 <strong>B2 Tip:</strong> {c.tip}</div>

        <table className="grammar-table">
          <thead>
            <tr>{c.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {c.table.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className={j === 0 ? "hl" : ""}>
                    {c.table.highlight.includes(j) && j === 0 ? <strong>{cell}</strong> : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="examples-label">Examples</div>
        {c.examples.map((ex, i) => (
          <div key={i} className="example-row">
            <div className="ex-de">{ex.de}</div>
            <div className="ex-en">{ex.en}</div>
          </div>
        ))}

        <button className="btn-ai-explain" onClick={getAiExplanation} disabled={loadingAi}>
          {loadingAi ? "⏳ Loading..." : "✨ Ask AI tutor for tips"}
        </button>

        {aiExplanation && (
          <div className="ai-explanation">
            <div className="ai-explanation-label">AI Tutor</div>
            <div className="ai-explanation-text">{aiExplanation}</div>
          </div>
        )}
      </div>
    </div>
  );
}