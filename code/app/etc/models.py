from datetime import datetime
from enum import unique
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(30), unique=True)
    full_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    hashed_password = Column(String)
    group_id = Column(Integer, ForeignKey('group.id'), nullable=False)
    is_active = Column(Boolean, default=True)

    group = relationship('Group', back_populates='members')

class Group(Base):
    __tablename__ = 'group'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(30), unique=True)
    description = Column(String, nullable=True)

    members = relationship('User', back_populates='group')

