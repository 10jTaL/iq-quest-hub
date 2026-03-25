FROM mcr.microsoft.com/windows/servercore:ltsc2022

SHELL ["cmd", "/S", "/C"]

# Installer Chocolatey
RUN powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; \
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; \
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"

# Installer Node.js via Chocolatey
RUN choco install -y nodejs-lts

WORKDIR C:/app

# Installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du code
COPY . .

# Build TypeScript → crée dist/
RUN npm run build

EXPOSE 3000

# Lancer le backend compilé
CMD ["C:\\Program Files\\nodejs\\node.exe", "dist\\index.js"]
# ou, si tu préfères utiliser le script start :
# CMD ["C:\\Program Files\\nodejs\\npm.cmd", "run", "start"]