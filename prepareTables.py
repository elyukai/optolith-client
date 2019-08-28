import base64
import sys
import os
import os.path
import zipfile

import cryptography
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.fernet import Fernet

def decryptTables():
    print("Decrypting tables")
    # Obtain key from enviroment variable
    key = os.environ['OPTOLITH_KEY']

    # Create encryption key
    salt = b'optolithSalt'
    kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256(),
    length=32,
    salt=salt,
    iterations=100000,
    backend=default_backend())
    cryptoKey = base64.urlsafe_b64encode(kdf.derive(key.encode(encoding='UTF-8'))) 

    # Encrypt file
    f = Fernet(cryptoKey)
    with open("Tables.crypto", "rb") as sourceFile:
        with open("Tables.zip", "wb") as targetFile:
            # encrypted = base64.encodebytes(sourceFile.read())
            decrypted = f.decrypt(sourceFile.read())
            targetFile.write(decrypted)
    print("Tables decrypted")

def prepareTables():
    print("Unpacking tables")
    # Unpack zip file
    os.mkdir("tables")
    with zipfile.ZipFile("Tables.zip", 'r') as zip_ref:
        zip_ref.extractall("tables")
    # Create tablesSrc.json
    with open(os.path.join("deploy", "tablesSrc.json"), "w") as f:
        f.write("{\n\"stable\": [\".\", \"tables\"],\n\"insider\": [\".\", \"tables\", \"insider\"]\n}")
    print("Tables unpacked")


if __name__ == "__main__":
    print("Start to prepare tables...")
    decryptTables()
    prepareTables()
    print("Preparing tables finished")