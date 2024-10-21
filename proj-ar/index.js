const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    console.log(`Requisição recebida para: ${req.url}`);

    // Ajuste o caminho base para o diretório 'proj-ar'
    let safePath = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(__dirname, safePath === "/" ? "index-ar.html" : safePath);

    console.log(`Tentando acessar o arquivo: ${filePath}`);

    // Define o tipo de conteúdo baseado na extensão do arquivo
    const extname = path.extname(filePath).toLowerCase();
    let contentType = "text/html"; // Padrão: HTML

    const mimeTypes = {
        ".js": "text/javascript",
        ".css": "text/css",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".html": "text/html",
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".woff": "font/woff",
        ".woff2": "font/woff2",
    };

    contentType = mimeTypes[extname] || "application/octet-stream";

    // Lê o arquivo e serve
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === "ENOENT") {
                // Arquivo não encontrado - 404
                console.error(`Arquivo não encontrado: ${filePath}`);
                fs.readFile(path.join(__dirname, "404.html"), (err404, data404) => {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end(err404 ? "Página não encontrada" : data404);
                });
            } else {
                // Outro erro - 500
                console.error(`Erro ao ler arquivo: ${err}`);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Erro no servidor");
            }
        } else {
            console.log(`Arquivo servido com sucesso: ${filePath}`);
            // Configura cache básico
            res.writeHead(200, {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=3600", // Cache de 1 hora
            });
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
