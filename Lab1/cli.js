    import fs from "fs/promises";

    let users = JSON.parse(await fs.readFile("./users.json", "utf-8"));
    const [, , action, arg1, arg2] = process.argv;

    function showAll() {
    console.log(users);
    }

    function showOne(id) {
    const user = users.find(u => u.id === Number(id));
    console.log(user || "User not found");
    }

    function createUser(name) {
    const newUser = { id: Date.now(), name };
    users.push(newUser);
    fs.writeFile("./users.json", JSON.stringify(users, null, 2));
    console.log("Added:", newUser);
    }

    function deleteUser(id) {
    const oldLength = users.length;
    users = users.filter(u => u.id !== Number(id));
    if (users.length === oldLength) {
        console.log("User not found");
        return;
    }
    fs.writeFile("./users.json", JSON.stringify(users, null, 2));
    console.log("Removed user with id:", id);
    }

    function updateUser(id, newName) {
    const user = users.find(u => u.id === Number(id));
    if (!user) {
        console.log("User not found");
        return;
    }
    user.name = newName;
    fs.writeFile("./users.json", JSON.stringify(users, null, 2));
    console.log("Updated:", user);
    }

    switch (action) {
    case "getall":
        showAll();
        break;
    case "getone":
        showOne(arg1);
        break;
    case "add":
        createUser(arg1);
        break;
    case "remove":
        deleteUser(arg1);
        break;
    case "edit":
        updateUser(arg1, arg2);
        break;
    default:
        console.log("Unknown action");
    }
