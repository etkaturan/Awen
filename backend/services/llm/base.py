from abc import ABC, abstractmethod

class BaseLLM(ABC):
    @abstractmethod
    async def chat(self, messages: list, system: str = "") -> str:
        pass

    @abstractmethod
    def is_configured(self) -> bool:
        pass
