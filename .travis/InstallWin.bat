REM Install python
choco install python --version 3.7.2
REM Install pip
choco install pip 
REM Install OpenSSL
choco install openssl.light 
REM Install needed packages
C:/Python37/python.exe -m pip install cryptography
REM Decrypt tables
C:/Python37/python.exe prepareTables.py
REM Prepare node
npm i