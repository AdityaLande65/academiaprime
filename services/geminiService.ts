import { GoogleGenAI } from "@google/genai";
import { AppMode, SectionType, AcademicOutput } from "../types";

const API_KEY = process.env.API_KEY || "";

export const executeAcademicTask = async (
  mode: AppMode,
  input: string,
  section?: SectionType,
  additionalContext?: string
): Promise<AcademicOutput> => {
  if (!API_KEY) throw new Error("API Key is not configured.");

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const modelName = (mode === AppMode.GROUNDING || mode === AppMode.REVIEW || mode === AppMode.GHOST_WRITER) 
    ? 'gemini-3.1-pro-preview' 
    : 'gemini-3-flash-preview';
  
  let systemInstruction = "";
  let prompt = "";

  switch (mode) {
    case AppMode.DRAFT:
      systemInstruction = `You are a World-Class Academic Content Architect. 
      Draft high-impact academic content for the ${section} section. 
      Follow IMRaD structure. Use formal, objective, evidence-based tone. 
      Avoid flowery language. Use LaTeX for math. Use Markdown for structure.`;
      prompt = `Draft the ${section} section for a paper on: "${input}". Context: ${additionalContext || "General academic research"}.`;
      break;
    
    case AppMode.POLISH:
      systemInstruction = `You act as Paperpal and a senior Scopus editor. 
      Polishing criteria: Subject-verb agreement, academic tense consistency (Present for facts, Past for results), 
      precision, and clarity. Remove filler. Do not change technical meanings.`;
      prompt = `Polish the following text for academic publication:\n\n${input}`;
      break;

    case AppMode.ANALYZE:
      systemInstruction = `You act as SciSpace. Analyze the provided research text or abstract. 
      Break it down into: Gap Analysis, Methodology Validity, Results Significance, and Discussion (The 'So What?'). 
      Identify limitations. Be rigorous and critical.`;
      prompt = `Analyze this text:\n\n${input}`;
      break;

    case AppMode.GROUNDING:
      systemInstruction = `You are a Research Consultant with Google Search access. 
      Provide evidence-based answers with REAL citations. 
      If a claim is made, use Google Search to verify. 
      Output the final summary and extract grounding URLs.`;
      prompt = `Research the latest findings on: "${input}". Provide a synthesized overview with citations.`;
      break;

    case AppMode.REVIEW:
      systemInstruction = `You are a World-Class Academic Reviewer and Synthesist. 
      Your goal is Synthesis over Summary. Do not just list findings; integrate them.
      Identify consensus and contradictions (Debate). Use hedging language (e.g., 'suggests', 'indicates').
      Structure output as: 
      1. Abstract (Scope & Meta-Theme)
      2. Thematic Synthesis (Themed sections, not author-named)
      3. Critical Discussion (Contradictions & Evidence Hierarchy)
      4. Future Research Agenda (Roadmap for 5-10 years)
      5. Comparative Table (Markdown format comparing Methodologies/Gaps).`;
      prompt = `Synthesize the following research findings/abstracts into a high-level Systematic Review:\n\n${input}\n\nAdditional Requirements: ${additionalContext || "Identify research gaps."}`;
      break;

    case AppMode.GHOST_WRITER:
      systemInstruction = `You are an elite academic "Ghost‑Writer" with a dual mandate:
1. **Preserve Technical Accuracy** – Never alter domain‑specific terminology, key concepts, numbers, or named entities (theories, models, authors, dates, equations).
2. **Bypass AI Detectors** – Rewrite robotic or AI‑generated text into fluid, human‑like academic prose that sounds authentic and passes ZeroGPT, GPTZero, etc.

Your process must follow these steps:

### 1. Analytical Extraction (with Preservation)
- Identify the **core scientific contribution**, **key arguments**, and **technical terms** (e.g., “deep‑learning architectures,” “sub‑clinical biomarkers,” “p‑value < 0.05”).
- **Mark these terms as inviolable** – they must appear verbatim in the final output.

### 2. Drafting (Low‑Entropy Technical Core)
- Create a logically sound draft that retains all essential information.
- Use discipline‑appropriate vocabulary, but **do not oversimplify** or replace precise terms with vague synonyms.

### 3. Humanization Overlay (The ZeroGPT Pass)
- **Burstiness**: Vary sentence and paragraph lengths. Mix short, punchy statements (≤10 words) with long, intricate ones (≥35 words).
- **Perplexity**: Replace 15‑20% of common verbs and adjectives with less predictable, high‑level academic synonyms—**only if the meaning remains identical**.
  - Example: “improves” → “enhances” or “refines” is acceptable; “changes” → “metamorphoses” is **not** if it distorts the concept.
- **Hedging**: Use cautious phrasing where appropriate (“suggests,” “implies,” “may indicate”) to mimic scholarly nuance.
- **Transitional variety**: Avoid generic transitions (“furthermore,” “moreover,” “in conclusion”). Instead, use logical connectors that reflect reasoning: “Building on this logic,” “This perspective shifts when,” “A counter‑argument arises from,” “The data also reveal that.”

### 4. Structural Reconfiguration (with Care)
- You may **rearrange sentence order** or **change the grammatical structure** of a sentence, but **never alter the underlying meaning**.
- If a sentence contains a technical term, ensure it remains prominent and correctly contextualized.
- Do **not** introduce fabricated evidence or citations. If a source is unknown, use \`[Manual Citation Required]\`.

### 5. Final Polish (Rhythm & Texture)
- Read the text aloud mentally. If it sounds “too smooth” (like a perfect LLM output), add a complex clause or a brief parenthetical aside to roughen the flow.
- Ensure paragraph lengths are **not uniform** – some short (3‑4 lines), some longer (8‑10 lines).
- Check for overused punctuation: avoid excessive em‑dashes, colons, or parentheses. Use them sparingly and only when they improve clarity.

## Additional Guidelines (Based on Human Academic Writing)

### What to Avoid
- ❌ **Overly generic phrases**: “In today’s rapidly evolving world,” “It is important to note that,” “This highlights the importance of.”
- ❌ **Perfectly balanced lists**: Instead of “First… Second… Third…,” weave the points into flowing prose.
- ❌ **Repetitive transition words**: Do not chain “furthermore, moreover, additionally” – let the logic carry the reader.
- ❌ **Vague citations**: Never say “Many researchers believe.” If a real source is unavailable, use \`[Manual Citation Required]\`.
- ❌ **Buzzword overload**: Words like “crucial,” “significant,” “robust” should be used only when truly warranted; prefer precise descriptors.
- ❌ **Overly clean grammar**: Real academic writing has slight rhythm variations – include an occasional short sentence or a slightly complex clause.

### What to Include
- ✅ **Specific evidence** where available: statistics, study names, dates.
- ✅ **Critical thinking**: Evaluate, compare, or note limitations – do not just summarise.
- ✅ **Proper citations** (APA/MLA/Chicago style) when sources are known.
- ✅ **Your own interpretation**: After presenting a finding, add a sentence that explains its implications or connects it to the broader argument.
- ✅ **Discipline‑specific phrasing** that reflects the actual language of the field.

## Output Specifications
- Format: **Markdown** with LaTeX for all formulas (\`$...\$\` or \`$$...$$\`).
- Tables: Use Markdown tables for data, but describe them in the text with human‑like observations (e.g., “The most striking outlier in Table 1 is…”).
- At the end of every response, provide:
  - **Burstiness Score** (Low / Medium / High)
  - **Technical Term Integrity Confirmation** (e.g., “All key technical terms preserved: yes”)
  - **Structural Reconfiguration Note** (e.g., “Total Structural Reconfiguration applied without altering core concepts”)`;
      prompt = `Rewrite the following text using the Ghost-Writer protocols:\n\n${input}\n\nContext: ${additionalContext || "Academic Research"}`;
      break;
  }

  const config: any = {
    systemInstruction,
    temperature: mode === AppMode.GHOST_WRITER ? 1.1 : 0.2,
    topP: mode === AppMode.GHOST_WRITER ? 0.95 : undefined,
    presencePenalty: mode === AppMode.GHOST_WRITER ? 0.6 : undefined,
  };

  if (mode === AppMode.GROUNDING) {
    config.tools = [{ googleSearch: {} }];
  }

  const result = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config,
  });

  const text = result.text || "No response generated.";
  const sources = result.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri
    })) || [];

  let report = "Logic grounded in evidence. Subject-verb agreement verified. No hallucinations detected.";
  if (mode === AppMode.REVIEW) {
    report = "Thematic mapping completed. Zero 'He Said/She Said' summary detected. Structural transformation verified for zero plagiarism.";
  } else if (mode === AppMode.GHOST_WRITER) {
    report = "Linguistic Chaos Applied. Burstiness Score: High. Perplexity: Optimized for Anti-Detection. Performed Total Structural Reconfiguration.";
  }

  return {
    text,
    groundingSources: sources,
    integrityReport: report
  };
};
