import os
from pathlib import Path

# to get a string like this run:
# openssl rand -hex 32

BASE_DIR = Path(__file__).resolve().parent.parent # /code

# construct project
HTML_DIR = os.path.join(BASE_DIR, "html")
STATIC_DIR = os.path.join(BASE_DIR, "static")
CERT_DIR = os.path.join(BASE_DIR, "well-known")
JS_BOOTSTRAP = "/usr/local/lib/node_modules/bootstrap/dist/js"
JS_POPPER = '/usr/local/lib/node_modules/bootstrap/node_modules/@popperjs/core/dist/esm'
APP_DIR = os.path.join(BASE_DIR, 'app')
TEMPLATE_DIR = os.path.join(APP_DIR, 'templates')
