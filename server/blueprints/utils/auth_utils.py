from jwt import decode as jwt_decode, ExpiredSignatureError, InvalidTokenError
from dotenv import load_dotenv
import os


load_dotenv()
JWT_SECRET = os.environ.get('JWT_SECRET')

def decode_auth_header(auth_header):
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, 'Missing or invalid authorization header'
    
    token = auth_header.split(" ")[1]

    try:
        payload = jwt_decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload, None
    except ExpiredSignatureError:
        return None, 'Token has expired'
    except InvalidTokenError:
        return None, 'Invalid token'