from abc import ABC, abstractmethod


class IStorageRepository(ABC):
    @abstractmethod
    def sync_model(self):
        raise NotImplementedError

    @abstractmethod
    def download_cookies(self):
        raise NotImplementedError
