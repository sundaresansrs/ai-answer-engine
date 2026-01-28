def classify_question(question: str) -> str:
    q = question.lower().strip()

    if q.startswith("what is"):
        return "definition"
    if q.startswith("why"):
        return "why"
    if q.startswith("how"):
        return "how"
    if " vs " in q or "difference between" in q:
        return "comparison"
    if "steps" in q or "algorithm" in q:
        return "procedural"

    return "exploratory"


def clean_text(text: str) -> str:
    text = text.replace("…", "")
    text = text.replace("...", "")
    return text.strip()


def is_definition_safe(sentence: str) -> bool:
    bad_terms = ["dog", "policy", "metaphor", "analogy"]
    s = sentence.lower()
    return not any(t in s for t in bad_terms)


def format_answer(question_type: str, ranked_facts: list[str]) -> str:
    if not ranked_facts:
        return "I could not find sufficient reliable information to answer this question."

    ranked_facts = [clean_text(f) for f in ranked_facts if len(f) > 40]

    if question_type == "definition":
        safe = [f for f in ranked_facts if is_definition_safe(f)]
        selected = safe[:5]

        paragraph = " ".join(selected)

        return paragraph

    if question_type in ["why", "how"]:
        p1 = " ".join(ranked_facts[:2])
        p2 = " ".join(ranked_facts[2:4])
        return f"{p1}\n\n{p2}".strip()

    if question_type == "comparison":
        return "\n".join(f"- {f}" for f in ranked_facts[:5])

    if question_type == "procedural":
        return "\n".join(
            f"{i+1}. {f}" for i, f in enumerate(ranked_facts[:5])
        )

    parts = [
        " ".join(ranked_facts[i:i+2])
        for i in range(0, 6, 2)
        if ranked_facts[i:i+2]
    ]
    return "\n\n".join(parts)
