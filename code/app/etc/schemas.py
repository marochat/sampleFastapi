from datetime import datetime
from pydantic import BaseModel
import uuid


class UserBase(BaseModel):
    username: str
    full_name: str | None = None
    email: str | None = None
    group: str


class UserCreate(UserBase):
    password: str

class Group(BaseModel):
    name: str
    description: str | None

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None

class UserInDB(User):
    hashed_password: str
