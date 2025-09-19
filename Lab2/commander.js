    import { Command } from "commander";
    import fs from "fs/promises";

    const program = new Command();
    const filePath = "./users.json";

    async function loadUsers() {
        const data = await fs.readFile(filePath, "utf-8");
        if (data) {
        return JSON.parse(data);
        }else{
        return [];
        }
    }

    async function saveUsers(users) {
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
    }


    program
    .command("getall")
    .description("Show all users")
    .action(async () => {
        const users = await loadUsers();
        console.log(users);
    });

    program
    .command("getone <id>")
    .description("Show one user by id")
    .action(async (id) => {
        const users = await loadUsers();
        const user = users.find((u) => u.id === Number(id));
        console.log(user || "User not found");
    });

    program
    .command("add <name>")
    .description("Add a new user")
    .action(async (name) => {
        const users = await loadUsers();
        const newUser = { id: Date.now(), name };
        users.push(newUser);
        await saveUsers(users);
        console.log("Added:", newUser);
    });

    program
    .command("remove <id>")
    .description("Remove a user by id")
    .action(async (id) => {
        let users = await loadUsers();
        const oldLength = users.length;
        users = users.filter((u) => u.id !== Number(id));
        if (users.length === oldLength) {
        console.log("User not found");
        return;
        }
        await saveUsers(users);
        console.log("Removed user with id:", id);
    });

    program
    .command("edit <id> <newName>")
    .description("Edit a user’s name")
    .action(async (id, newName) => {
        const users = await loadUsers();
        const user = users.find((u) => u.id === Number(id));
        if (!user) {
        console.log("User not found");
        return;
        }
        user.name = newName;
        await saveUsers(users);
        console.log("Updated:", user);
    });

    program.parse();