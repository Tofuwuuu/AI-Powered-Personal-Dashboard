def build_structured_prompt(text: str) -> str:
    return (
        "You are an analysis engine. Return only JSON with keys: "
        "summary, classification, sentiment, key_topics, action_items, confidence. "
        "sentiment must be one of positive, neutral, negative. "
        "confidence must be a float between 0 and 1. "
        f"Analyze this text: {text}"
    )
