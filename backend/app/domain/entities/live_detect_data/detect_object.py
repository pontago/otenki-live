from pydantic import BaseModel


class DetectObject(BaseModel):
    person: int = 0
    umbrella: int = 0
    tshirt: int = 0
    jacket: int = 0
    long_sleeve: int = 0
    outer: int = 0
