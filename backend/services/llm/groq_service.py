from groq import Groq
from services.llm.base import BaseLLM

class GroqService(BaseLLM):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = Groq(api_key=api_key) if api_key else None
        self.model = "llama-3.3-70b-versatile"

    def is_configured(self) -> bool:
        return bool(self.api_key and self.client)

    async def chat(self, messages: list, system: str = "") -> str:
        if not self.is_configured():
            raise ValueError("Groq API key not configured")

        all_messages = []
        if system:
            all_messages.append({"role": "system", "content": system})
        all_messages.extend(messages)

        response = self.client.chat.completions.create(
            model=self.model,
            messages=all_messages,
            max_tokens=1024,
        )
        return response.choices[0].message.content
