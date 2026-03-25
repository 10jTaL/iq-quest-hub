import { client } from "./client";

export type NewUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MASTER" | "USER";
};

export async function createUserInDb(user: NewUser) {
  const result = await client.query(
    `INSERT INTO users (name, email, role)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role`,
    [user.name, user.email, user.role]
  );

  return result.rows[0];
}

export async function getAllUsersFromDb(): Promise<NewUser[]> {
  const result = await client.query(
    "SELECT id, name, email, role FROM users ORDER BY name ASC"
  );
  return result.rows;
}

export async function updateUserInDb(user: NewUser) {
  const result = await client.query(
    `UPDATE users set role = $1
     where users.id = $2
     RETURNING id, role, name, email`,
    [user.role, user.id]
  );

  return result.rows[0];
}

export async function deleteUserInDb(user: NewUser) {
  const result = await client.query(
    `delete from users 
     where users.id = $1`,
    [user.id]
  );
  return result;
}

export const findUserRoleByEmail = async (email: string): Promise<string | null> => {
  const result = await client.query(
    'SELECT role FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0]?.role ?? null;
};