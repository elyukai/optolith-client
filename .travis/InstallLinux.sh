# Updated local cache
echo apt update
sudo apt update
# Install python and pip
echo apt install -y python3 python3-pip python3-setuptools python3-dev build-essential libssl-dev libffi-dev
sudo apt install -y python3 python3-pip python3-setuptools python3-dev build-essential libssl-dev libffi-dev
# Install needed package
echo python3 -m pip install cryptography
python3 -m pip install cryptography
# Decrypt tables
echo python3 prepareTables.py
python3 prepareTables.py
# Prepare node
echo npm ci
npm ci