from abc import ABC, abstractmethod


class ISQSRepository(ABC):
    @abstractmethod
    def send_message(self, queue_name: str, body: str) -> str:
        raise NotImplementedError
