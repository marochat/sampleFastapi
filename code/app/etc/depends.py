#
# common dependance proc
#
import re
from fastapi import Header

async def ajax_request(accept: str | None = Header(None)):
    if re.search('json', accept):
        return True
    return False
