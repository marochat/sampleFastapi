import re
from fastapi import Depends, FastAPI, Request, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse, HTMLResponse

from starlette.exceptions import HTTPException as StarletteHTTPException

from app import *

templates = Jinja2Templates(directory=TEMPLATE_DIR)

app = FastAPI()

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc):
    ''' 
    エラーページの導入 : acceptヘッダに応じてレスポンスタイプを変える
    accept json チェックをDependsで行おうとしたが、ハンドラにはDependsが効かないようなので
    手作業としている
    '''
    accept = request.headers.get("accept", "")
    if re.search('json$', accept):
        return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)
    return templates.TemplateResponse("errorPage.html", {
        "request": request,
        "detail": str(exc.detail),
        "code": exc.status_code,
    }, status_code = exc.status_code)

# root path functions
@app.get('/')
async def root(request: Request):
    '''
    サイトトップページ（index.html）
    /docsが使用できるようにaccept jsonにも対応
    Parameters
    ----------
        request: Request リクエスト構造体
    Returns
    ----------
        Response レスポンス型を明示的に返すことで Content-typeが設定される

    '''
    return templates.TemplateResponse(
        'index.html',
        {"request": request},
    )

# スタティック領域の宣言
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/.well-known", StaticFiles(directory=CERT_DIR), name="well-known")
app.mount("/js/bootstrap", StaticFiles(directory=JS_BOOTSTRAP), name="js-bootstrap")
app.mount("/js/popperjs", StaticFiles(directory=JS_POPPER), name="js-popper")
app.mount("/html", StaticFiles(directory=HTML_DIR, html=True))
