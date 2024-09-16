const http = require("http");

const fs = require("fs");

const server = http.createServer((req, res) => {

fs.readFile("./proj-vr/index-vr.html", (err, data) => {

if (err) {

res.writeHead(500, { "Content-Type": "text/plain" }); res.end("Erro ao ler o arquivo");

} else {

res.writeHead (200, { "Content-Type": "text/html" }); res.end(data);

}

});

});

server.listen(5000, () => {

console.log("Rodando na porta", 5000);

});