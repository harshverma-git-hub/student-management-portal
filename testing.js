import bcrypt from "bcryptjs";

const output=bcrypt.hashSync("Admin@123", 10);
console.log(output)