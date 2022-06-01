from enum import auto
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

from .models import User, Group
from . import crud, schemas

# メタデータよりテーブル作成
# デバッグ用に最初テーブル削除
Base.metadata.drop_all(bind=engine, tables=[User.__table__])
Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    '''
    get_db : データベースセッションを得るDI関数
        依存性後処理にてクローズする
    Returns
    --------
        Session -- オープンしたデータベースセッションオブジェクト
    '''
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

with SessionLocal() as session:
    session: Session  # 型ヒント
    q = session.query(Group).all()
    if q == []:
        group_init = [
            schemas.Group(name='admin', description='Administrators'),
            schemas.Group(name='users', description='normal users'),
            schemas.Group(name='guest', description='tempolary guest account')
        ]
        for grp in group_init:
            crud.create_group(session, grp)
    gid = session.query(Group).filter(Group.name == 'admin').first().id
    q = session.query(User).all()
    if q == []:
        user_data = schemas.UserCreate(
            username='admin',
            password='passwd',
            full_name='Administrator',
            group='admin',
            email='webmaster@loalhost'
        )
        crud.create_user(session, user_data)
