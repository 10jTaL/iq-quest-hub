FROM mcr.microsoft.com/windows/servercore:ltsc2022

SHELL ["cmd", "/S", "/C"]

RUN powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; \
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; \
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"

RUN choco install -y nodejs-lts

WORKDIR C:/app

COPY package*.json ./
RUN npm install

COPY . .

RUN if exist dist rmdir /S /Q dist
RUN npm run build

EXPOSE 8085

ENV SSL_KEY_PATH=C:/certs/key.pem
ENV SSL_CERT_PATH=C:/certs/cert.pem

CMD ["C:\\Program Files\\nodejs\\node.exe", "server.js"]