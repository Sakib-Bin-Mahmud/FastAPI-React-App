from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated,List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import Sessionlocal, engine
import models

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://localhost:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']

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
        orm_mode =True

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated [Session , Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

@app.post("/transactions/", response_model=TransactionModel)
async def create_transaction(transaction: TransactionBase, db: db_dependency):
    db_transaction = models.Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction 

@app.get ("/transactions/", response_model=List[TransactionModel])
async def read_transactions(db: db_dependency, skip: int = 0, limit: int = 100):
    transactiions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactiions

@app.put("/transactions/{transaction_id}", response_model=TransactionModel)
async def update_transaction(transaction_id: int, updated: TransactionBase, db: db_dependency):
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    for key, value in updated.dict().items():
        setattr(transaction, key, value)
    db.commit()
    db.refresh(transaction)
    return transaction


@app.delete("/transactions/{transaction_id}")
async def delete_transaction(transaction_id: int, db: db_dependency):
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}
