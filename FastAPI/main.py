from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated
from sqlalchemy.orm import session
from pydantic import BaseModel
from database import Sessionlocal, engine
import models

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,

)

class TransactionBase(BaseModel):
    amount: float
    category: str
    description: str
    is_income: bool
    date: str

class TransactionModel(TransactionBase):
    id: int

    class Config:
        orm_model =True
        