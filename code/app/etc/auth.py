from datetime import datetime, timedelta
import uuid

from fastapi import Cookie, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from .database import get_db
from .schemas import TokenData, User
from .crud import get_user_by_name, authenticate_user


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    '''
    create_access_token : トークン生成
    Parameter
    ---------
        data : dict -- {"sub": username} 形式の辞書データ
        expires_delta : timedelta -- 有効期間（分）（デフォルトは ACCESS_TOKEN_EXPIRE_MINUTES）
    Returns
    ---------
        str : 生成したトークン文字列
    '''
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

#
# Dependencies for Authorizetion
async def get_current_user_or_none(
    token: str = Depends(oauth2_scheme),
    Authorization: str = Cookie(None),
    db : Session = Depends(get_db),
    ) -> User | None:
    '''
    get_current_user_or_none : トークン認証用依存注入関数
    Parameters
    ----------
        token : str -- ヘッダから取り出したトークンデータ（oauth2_schemeに依存）
        Authorization : str -- クッキーに含まれるトークンデータ
        db : Session -- ユーザーデータ取得のためのデータベースセッション
    Returns
    ----------
        User | None -- 認証済みのユーザーデータ
    '''
    if token is None and Authorization:
        try:
            scheme, _, param = Authorization.partition(" ")
        except:
            scheme, param = "", ""
        if scheme.lower() == "bearer":
            token = param
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        else:
            token_data = TokenData(username=username)
            user = get_user_by_name(db, username=token_data.username)
            return user
    #except JWTError:
    except:
        return None

async def get_current_user(user : User = Depends(get_current_user_or_none)) -> User:
    '''
    get_current_user : トークン認証用依存注入関数（認証済みでない場合は例外をスローする）
    Parameters
    ----------
        user : User -- 実際の認証関数（get_current_user_or_none）に依存
    Returns
    ----------
        user : User 認証済みユーザーデータ
    '''
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    '''
    get_current_active_user : 認証済みアクティブユーザーの取得用依存注入関数（認証済みでない場合例外をスロー）
    Parameters
    ----------
        current_user : User -- 取得済ユーザー情報（get_current_userを依存注入）
    Returns
    ----------
        User -- is_active == True のユーザー
    '''
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_active_user_or_none(current_user: User = Depends(get_current_user_or_none)) -> User | None:
    '''
    get_current_active_user : 認証済みアクティブユーザーの取得用依存注入関数
    Parameters
    ----------
        current_user : User -- 取得済ユーザー情報（get_current_userを依存注入）
    Returns
    ----------
        User -- is_active == True のユーザー それ以外は None
    '''
    if current_user is None or current_user.is_active is None:
        return None
    return current_user

async def get_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    '''
    get_access_token : ログイン認証を行い、アクセストークンを得る（パズパラメータに使用するDI関数）
    Parameters
    ----------
        from_data : ログインフォームデータ
        db : 認証に使用するデータベース
    Returns
    ----------
        dict : scheme.Token へ注入する辞書形式データ
    '''
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
