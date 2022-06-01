from fastapi import APIRouter, HTTPException, Depends, status, Response, Request
from sqlalchemy import true
from sqlalchemy.orm import Session

from .auth import get_access_token, get_current_active_user, get_current_active_user_or_none

from . import crud, models, schemas

from .database import engine, get_db

router = APIRouter()

@router.post("/users/", response_model=schemas.User, dependencies=[Depends(get_current_active_user)])
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_name(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@router.get("/users/", response_model=list[schemas.User], dependencies=[Depends(get_current_active_user)])
def read_users(request: Request, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/users/{user_id}", response_model=schemas.User, dependencies=[Depends(get_current_active_user)])
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(response: Response, access_token: dict = Depends(get_access_token)):
    response.set_cookie(
        key="Authorization",
        value= access_token["token_type"] + ' ' + access_token["access_token"]
    )
    return access_token

@router.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_active_user)):
    return current_user

@router.get('/authcheck/')
async def auth_check(current_user: schemas.User | None = Depends(get_current_active_user_or_none)):
    auth: bool = False if current_user is None else True
    name: str = '' if current_user is None else current_user.username
    return {'auth': auth, 'name': name}

@router.get('/logoff/')
async def logoff_and_discard_token(response: Response):
    response.delete_cookie(key="Authorization")
    return {'detail': 'logoff'}
