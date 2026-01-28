def decompose_question(question: str) -> list[str]:
    if " and " in question.lower():
        return [q.strip() for q in question.split(" and ")]
    return [question]


def generate_reasoning_summary(sub_questions, used_web, used_local):
    steps = []

    for sq in sub_questions:
        steps.append(f"Analyzed sub-question: '{sq}'")

    if used_local:
        steps.append("Retrieved relevant information from internal company knowledge")

    if used_web:
        steps.append("Retrieved supporting information from live web sources")

    steps.append("Ranked evidence by relevance and synthesized a final answer")

    return steps
