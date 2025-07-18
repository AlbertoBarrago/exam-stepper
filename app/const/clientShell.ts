const QUESTION_KINDS = [
    "reading-question",
    "listening-question",
    "writing-question",
    "speaking-question",
];

const SECTIONS = ["reading", "listening", "writing", "speaking"] as const;

const stepKindToSection = (kind: string): string | null => {
    if (kind.startsWith("reading")) return "reading";
    if (kind.startsWith("listening")) return "listening";
    if (kind.startsWith("writing")) return "writing";
    if (kind.startsWith("speaking")) return "speaking";
    return null;
};

export {
    QUESTION_KINDS,
    SECTIONS,
    stepKindToSection,
}