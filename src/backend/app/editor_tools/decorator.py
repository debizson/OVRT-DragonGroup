from ..map_domain.map import Map

class Decorator:
    def __init__(self, theme: str = 'default'):
        self.theme = theme

    def apply_decoration(self, map_instance: Map):
        # Not implemented yet
        pass

    def change_theme(self, new_theme: str):
        self.theme = new_theme
