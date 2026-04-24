from abc import ABC, abstractmethod

from app.schemas.analysis import AnalysisStructuredOutput


class AIProvider(ABC):
    @abstractmethod
    def analyze_entry(self, text: str) -> AnalysisStructuredOutput:
        raise NotImplementedError
