from abc import ABC, abstractmethod


# Factory method pattern

class DBHandlerAbstract(ABC):
    def __init__(self, forras_nev: str):
        self.forras_nev = forras_nev

    def logolas(self, muvelet: str):
        print(f"{muvelet} művelet a(z) {self.forras_nev} forráson.")

    @abstractmethod
    def run(self, *args, **kwargs):
        pass