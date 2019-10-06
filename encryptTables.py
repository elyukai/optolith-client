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

def encryptTables(tableFolder):
    # Zip files into project
    zipf = zipfile.ZipFile('Tables.zip', 'w', zipfile.ZIP_DEFLATED)
    zipdir(tableFolder, zipf)
    zipf.close()

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
    with open("Tables.zip", "rb") as sourceFile:
        with open("Tables.crypto", "wb") as targetFile:
            encrypted = f.encrypt(sourceFile.read()) # For now. This creates larger files then necessary
            # encryptedBytes = base64.decodebytes(encrypted)
            targetFile.write(encrypted)

    # Delete old table zip
    os.remove("Tables.zip")


def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            (p, extension) = os.path.splitext(file)
            if extension == ".xlsx" :
                ziph.write(os.path.join(root, file), os.path.relpath(os.path.join(root, file), path))

if __name__ == "__main__":
    if(len(sys.argv)) == 1:
        path = input("Bitte Pfad zu den Tabellen eingeben:\n> ")
    else:
        path = sys.argv[1]
    encryptTables(path)