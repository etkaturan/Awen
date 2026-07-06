import { useState } from "react";
import "./TranslatorTab.css";
import { useLang } from "../context/LanguageContext";

interface TranslationResult {
  word: string;
  article?: string;
  pronunciation?: string;
  meanings: { definition: string; partOfSpeech: string; example?: string }[];
  synonyms: { word: string; note: string }[];
  examples: string[];
  notes?: string;
}

const LANG_NAMES: Record<string, string> = {
  en: "English", de: "German", ru: "Russian", kz: "Kazakh",
  es: "Spanish", fr: "French", tr: "Turkish", ar: "Arabic", zh: "Chinese",
  it: "Italian", ja: "Japanese",
};

export default function TranslatorTab({ apiKey }: { apiKey: string }) {
  const { t, learnLang, appLang } = useLang();
  const [query, setQuery]       = useState("");
  const [result, setResult]     = useState<TranslationResult | null>(null);
  const [loading, setLoading]   = useState(false);
  const [added, setAdded]       = useState(false);
  const [history, setHistory]   = useState<string[]>([]);

  const lookup = async (word?: string) => {
    const q = (word || query).trim();
    if (!q || loading) return;
    setLoading(true);
    setResult(null);
    setAdded(false);

    const interfaceLang = LANG_NAMES[appLang] || "English";
    const targetLang    = LANG_NAMES[learnLang] || "German";

    const prompt = `You are a language dictionary for ${targetLang}.
Analyze the word or phrase: "${q}"

IMPORTANT: Write ALL definitions, notes, and explanations in ${interfaceLang}.
Only the word itself, examples, and synonyms should be in ${targetLang}.

Return ONLY valid JSON in this exact format, no markdown:
{
  "word": "the word as given in ${targetLang}",
  "article": "grammatical article if applicable or null",
  "pronunciation": "IPA pronunciation",
  "meanings": [
    {"definition": "clear definition in ${interfaceLang}", "partOfSpeech": "part of speech in ${interfaceLang}", "example": "example sentence in ${targetLang}"}
  ],
  "synonyms": [
    {"word": "synonym in ${targetLang}", "note": "brief note on difference in ${interfaceLang}"}
  ],
  "examples": ["natural example sentence 1 in ${targetLang}", "natural example sentence 2", "natural example sentence 3"],
  "notes": "grammar notes and usage tips written in ${interfaceLang}"
}
Include all meanings if the word has multiple. Include 3-5 synonyms. Return only the JSON.`;

    try {
      const res = await fetch("http://127.0.0.1:8000/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          api_key: apiKey,
        }),
      });
      const data    = await res.json();
      const cleaned = data.response.replace(/```json|```/g, "").trim();
      const parsed  = JSON.parse(cleaned);
      setResult(parsed);
      setHistory(prev => [q, ...prev.filter(h => h !== q)].slice(0, 20));
    } catch {
      setResult(null);
    }
    setLoading(false);
  };

  const addToVocabulary = async () => {
    if (!result) return;
    try {
      await fetch("http://127.0.0.1:8000/vocabulary/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word_de: result.article ? `${result.article} ${result.word}` : result.word,
          word_en: result.meanings[0]?.definition || "",
          article: result.article || "",
        }),
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {}
  };

  return (
    <div className="trans-root">

      {/* ── Left panel ─────────────────────────────────────────────────── */}
      <div className="trans-left">
        <div className="trans-search-area">
          <div className="trans-search-title">{t("trans_title")}</div>
          <textarea
            className="trans-input"
            placeholder={t("trans_placeholder")}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); lookup(); }
            }}
            rows={3}
          />
          <button
            className="trans-lookup-btn"
            onClick={() => lookup()}
            disabled={loading || !query.trim()}
          >
            {loading ? t("loading") : `${t("trans_lookup")} →`}
          </button>
        </div>

        {history.length > 0 && (
          <div className="trans-history">
            <div className="trans-hist-label">Recent</div>
            {history.map((h, i) => (
              <button key={i} className="trans-hist-item" onClick={() => { setQuery(h); lookup(h); }}>
                {h}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Right panel ────────────────────────────────────────────────── */}
      <div className="trans-right">

        {/* Empty state */}
        {!result && !loading && (
          <div className="trans-empty">
            <div className="te-icon">🔍</div>
            <div className="te-title">Look up any word</div>
            <div className="te-sub">Type a word or phrase on the left to see its full breakdown — meanings, synonyms, examples, grammar notes, and pronunciation.</div>
            <div className="te-tips">
              <div className="tet-item">💡 Try: <strong>Nachhaltigkeit</strong></div>
              <div className="tet-item">💡 Try: <strong>obwohl</strong></div>
              <div className="tet-item">💡 Try: <strong>aufgrund</strong></div>
              <div className="tet-item">💡 Try: <strong>umsteigen</strong></div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="trans-empty">
            <div className="trans-spinner" />
            <div className="te-title">Looking up...</div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="trans-result">

            {/* Word header */}
            <div className="tr-header">
              <div className="tr-header-left">
                {result.article && <div className="tr-article">{result.article}</div>}
                <div className="tr-word">{result.word}</div>
                {result.pronunciation && <div className="tr-pron">[{result.pronunciation}]</div>}
              </div>
              <button className={`tr-add-btn ${added ? "added" : ""}`} onClick={addToVocabulary}>
                {added ? `✓ ${t("trans_added")}` : `+ ${t("trans_add_vocab")}`}
              </button>
            </div>

            {/* Meanings */}
            <div className="tr-section">
              <div className="tr-section-title">{t("trans_meanings")}</div>
              {result.meanings.map((m, i) => (
                <div key={i} className="tr-meaning">
                  <div className="trm-top">
                    <span className="trm-pos">{m.partOfSpeech}</span>
                    <span className="trm-def">{m.definition}</span>
                  </div>
                  {m.example && <div className="trm-example">"{m.example}"</div>}
                </div>
              ))}
            </div>

            {/* Synonyms */}
            {result.synonyms?.length > 0 && (
              <div className="tr-section">
                <div className="tr-section-title">{t("trans_synonyms")}</div>
                <div className="tr-synonyms">
                  {result.synonyms.map((s, i) => (
                    <div key={i} className="tr-synonym" onClick={() => { setQuery(s.word); lookup(s.word); }}>
                      <div className="trs-word">{s.word}</div>
                      <div className="trs-note">{s.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examples */}
            {result.examples?.length > 0 && (
              <div className="tr-section">
                <div className="tr-section-title">{t("trans_examples")}</div>
                {result.examples.map((ex, i) => (
                  <div key={i} className="tr-example-row">
                    <span className="tre-num">{i + 1}</span>
                    <span className="tre-text">{ex}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Notes */}
            {result.notes && (
              <div className="tr-notes">
                <span className="trn-icon">📌</span>
                <span className="trn-text">{result.notes}</span>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}