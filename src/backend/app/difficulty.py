# Nehézség kiszámítása
class DifficultyCalculator:
    @staticmethod
    def calculate(items):
        count = len(items)
        if count <= 3:
            return "easy"
        elif 4 <= count <= 6:
            return "medium"
        else:
            return "hard"