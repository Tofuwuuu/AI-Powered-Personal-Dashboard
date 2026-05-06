from types import SimpleNamespace

from app.schemas.analysis import AnalysisStructuredOutput
from app.services.ai import google_provider
from app.services.ai.google_provider import GoogleProvider


class FakeGenerateContentConfig:
    def __init__(self, **kwargs) -> None:
        self.kwargs = kwargs


class FakeModels:
    def __init__(self) -> None:
        self.kwargs = {}

    def generate_content(self, **kwargs):
        self.kwargs = kwargs
        return SimpleNamespace(
            parsed=AnalysisStructuredOutput(
                summary="A brief journal summary.",
                classification="reflection",
                sentiment="positive",
                key_topics=["planning", "focus"],
                action_items=["Review goals"],
                confidence=0.91,
            ),
        )


class FakeClient:
    models = FakeModels()

    def __init__(self, api_key: str) -> None:
        self.api_key = api_key
        self.models = self.__class__.models


def test_google_provider_uses_gemini_structured_output(monkeypatch) -> None:
    monkeypatch.setenv("GOOGLE_API_KEY", "test-key")
    monkeypatch.setattr(google_provider.genai, "Client", FakeClient)
    monkeypatch.setattr(google_provider.types, "GenerateContentConfig", FakeGenerateContentConfig)

    output = GoogleProvider().analyze_entry("I felt focused and made progress today.")

    assert output.sentiment == "positive"
    assert output.classification == "reflection"
    assert output.key_topics == ["planning", "focus"]
    assert output.confidence == 0.91
    assert FakeClient.models.kwargs["model"] == "gemini-2.0-flash"
    assert FakeClient.models.kwargs["config"].kwargs["response_mime_type"] == "application/json"
    assert FakeClient.models.kwargs["config"].kwargs["response_schema"] is AnalysisStructuredOutput
