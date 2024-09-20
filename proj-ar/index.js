const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    console.log(`Requisição recebida para: ${req.url}`);

    // Ajuste o caminho base para o diretório 'proj-ar'
    let filePath = path.join(__dirname, req.url === "/" ? "/index-ar.html" : req.url);
    
    console.log(`Tentando acessar o arquivo: ${filePath}`);

    // Define o tipo de conteúdo baseado na extensão do arquivo
    const extname = path.extname(filePath);
    let contentType = "text/html"; // Por padrão, HTML

    // Mapeia extensões de arquivo para o tipo correto
    switch (extname) {
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".jpg":
        case ".jpeg":
            contentType = "image/jpeg";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".html":
            contentType = "text/html";
            break;
    }

    // Lê o arquivo e serve
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === "ENOENT") {
                // Arquivo não encontrado
                console.error(`Arquivo não encontrado: ${filePath}`);
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end("Arquivo não encontrado");
            } else {
                // Outro erro
                console.error(`Erro ao ler arquivo: ${err}`);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Erro no servidor");
            }
        } else {
            console.log(`Arquivo servido com sucesso: ${filePath}`);
            // Servir o arquivo com o tipo correto
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data, "utf-8");
        }
    });
});

// Rodar o servidor na porta 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Diretório atual do servidor: ${__dirname}`);
});