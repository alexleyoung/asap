from typing import Annotated
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
import bcrypt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = fake_decode_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def hash_password(pwd: str):
    if isinstance(pwd, str):
        pwd = pwd.encode()
    return bcrypt.hashpw(pwd, bcrypt.gensalt(12)).decode()
