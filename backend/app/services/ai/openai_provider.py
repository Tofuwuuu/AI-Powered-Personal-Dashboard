import json

from openai import OpenAI

from app.core.config import settings
from app.schemas.analysis import AnalysisStructuredOutput
from app.services.ai.base import AIProvider
from app.services.prompting import build_structured_prompt


class OpenAIProvider(AIProvider):
    def __init__(self) -> None:
        self.client = OpenAI(api_key=settings.openai_api_key)

    def analyze_entry(self, text: str) -> AnalysisStructuredOutput:
        prompt = build_structured_prompt(text)
        response = self.client.responses.create(
            model=settings.openai_model,
            input=[{"role": "user", "content": prompt}],
            text={
                "format": {
                    "type": "json_schema",
                    "name": "analysis_output",
                    "schema": AnalysisStructuredOutput.model_json_schema(),
                    "strict": True,
                }
            },
        )
        return AnalysisStructuredOutput.model_validate(json.loads(response.output_text))
