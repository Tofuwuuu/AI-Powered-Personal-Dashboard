import os

from google import genai
from google.genai import errors, types

from app.core.config import settings
from app.schemas.analysis import AnalysisStructuredOutput
from app.services.ai.base import AIProvider
from app.services.prompting import build_structured_prompt


class GoogleProvider(AIProvider):
    def __init__(self) -> None:
        api_key = settings.google_api_key or os.getenv("GOOGLE_API_KEY", "")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY is not set. Add it to the environment before running the worker.")
        self.client = genai.Client(api_key=api_key)

    def analyze_entry(self, text: str) -> AnalysisStructuredOutput:
        prompt = build_structured_prompt(text)
        try:
            response = self._generate(settings.google_model, prompt)
        except errors.ServerError as exc:
            if getattr(exc, "status_code", None) != 503 or settings.google_model == settings.google_fallback_model:
                raise
            response = self._generate(settings.google_fallback_model, prompt)

        if response.parsed is None:
            raise ValueError("Gemini did not return a valid structured analysis response.")

        return AnalysisStructuredOutput.model_validate(response.parsed)

    def _generate(self, model: str, prompt: str):
        response = self.client.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AnalysisStructuredOutput,
            ),
        )
        return response
