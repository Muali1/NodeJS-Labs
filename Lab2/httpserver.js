    import http from "http";
    import fs from "fs/promises";

    async function loadUsers() {
    try {
        const data = await fs.readFile("./users.json", "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
    }

    async function saveUsers(users) {
    await fs.writeFile("./users.json", JSON.stringify(users, null, 2));
    }

    const server = http.createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    let users = await loadUsers();

    if (req.method === "GET" && req.url === "/users") {
        res.writeHead(200);
        res.end(JSON.stringify(users));
    }

    else if (req.method === "GET" && req.url.startsWith("/users/")) {
        const id = Number(req.url.split("/")[2]);
        const user = users.find((u) => u.id === id);
        if (user) {
        res.writeHead(200);
        res.end(JSON.stringify(user));
        } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "User not found" }));
        }
    }

    else if (req.method === "POST" && req.url === "/users") {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
        const { name } = JSON.parse(body);
        const newUser = { id: Date.now(), name };
        users.push(newUser);
        await saveUsers(users);
        res.writeHead(201);
        res.end(JSON.stringify(newUser));
        });
    }

    else if (req.method === "PUT" && req.url.startsWith("/users/")) {
        const id = Number(req.url.split("/")[2]);
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
        const { name } = JSON.parse(body);
        const user = users.find((u) => u.id === id);
        if (!user) {
            res.writeHead(404);
            res.end(JSON.stringify({ message: "User not found" }));
            return;
        }
        user.name = name;
        await saveUsers(users);
        res.writeHead(200);
        res.end(JSON.stringify(user));
        });
    }

    else if (req.method === "DELETE" && req.url.startsWith("/users/")) {
        const id = Number(req.url.split("/")[2]);
        const oldLength = users.length;
        users = users.filter((u) => u.id !== id);
        if (users.length === oldLength) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "User not found" }));
        return;
        }
        await saveUsers(users);
        res.writeHead(200);
        res.end(JSON.stringify({ message: `User ${id} deleted` }));
    }

    else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Route not found" }));
    }
    });

    server.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
    });
