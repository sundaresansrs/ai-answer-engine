from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    if not token:
        raise HTTPException(status_code=401, detail="Invalid token")

    return f"user_{hash(token) % 100000}"
