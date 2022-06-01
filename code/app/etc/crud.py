from sqlalchemy.orm import Session
from passlib.context import CryptContext

from . import models, schemas

def get_user(db: Session, id: int):
    '''
    get_user : DB操作関数idによるユーザー問い合わせ
    Parameters
    ----------
        db: Session -- SQLAlchemy データベースセッション
        id: inr -- 問い合わせid

    '''
    return db.query(models.User).filter(models.User.id == id).first()


def get_user_by_name(db: Session, username: str):
    '''
    get_user_by_name : DB操作関数 user_id(username)による問い合わせ
    Parameters
    ----------
        db: Session -- SQLAlchemy データベースセッション
        username: str -- 問い合わせユーザー名
    '''
    return db.query(models.User).filter(models.User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    '''
    get_users : DB操作関数ユーザー情報のリストを得る
    Parameters
    ----------
        db: Session -- SQLAlchemy データベースセッション
        skip : int -- 問い合わせ先頭ID
        limit : int --  最大取得数
    '''
    ret =  db.query(models.User).offset(skip).limit(limit).all()
    return ret


def create_user(db: Session, user: schemas.UserCreate):
    '''
    create_user : DB操作関数 - ユーザーアカウント作成
    Parameters
    ----------
        db: Session -- SQLAlchemy データベースセッション
        user : UserCreate -- 作成するユーザーデータ : pydanticオブジェクト
    '''
    #fake_hashed_password = user.password + "notreallyhashed"
    q = db.query(models.Group).filter(models.Group.name==user.group).first()
    gid = q.id if q else 3
    db_user = models.User(
        username=user.username,
        full_name=user.full_name,
        email=user.email,
        group_id=gid,
        hashed_password=get_password_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_group(db: Session, group: schemas.Group):
    '''
    create_group
    '''
    db_group = models.Group(
        name= group.name,
        description=group.description
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    '''
    verify_password : 入力したプレーンパスワードとDBのハッシュ値と照合する
    Parameters
    ----------
        plain_password : str -- 入力パスワード
        hashed_password : str -- ハッシュ値
    '''
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    '''
    get_password_hash : プレーンパワードをから保存用のハッシュ値を得る
    Parameters
    ----------
        password : str -- 入力プレーンパスワード
    Rerurns
    -------
        str -- ハッシュ値
    '''
    return pwd_context.hash(password)


def authenticate_user(db: Session, username: str, password: str):
    '''
    authenticate_user : ユーザー名とパスワードをDB照合する
    Parameters
    ----------
        username: str -- ユーザー名
        password: str -- プレーンパスワード
    Returns
    ----------
        bool -- 照合OKであれば True
    '''
    user = get_user_by_name(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

