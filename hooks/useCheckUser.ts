import * as SQLite from 'expo-sqlite';
import { User } from '../types/types';

// SQLite.deleteDatabaseAsync('mydb');
// console.log('all users deleted.');
const dbPromise = SQLite.openDatabaseAsync('mydb');

export const checkUserLoggedIn = async (): Promise<boolean | null> => {
  const db = await dbPromise;

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY NOT NULL, email TEXT, fullname TEXT, accessToken TEXT);
  `);

  // Check if user with id = 1 exists and has a non-null accessToken
  const user = await db.getFirstAsync<{ id: number, accessToken: string }>(
    'SELECT id, accessToken FROM user WHERE id = 1 AND accessToken IS NOT NULL'
  );

  console.log('Retrieved user:', user);

  const users = await db.getAllAsync<{ id: number, email: string, fullname: string, accessToken: string }>(
    'SELECT id, email, fullname, accessToken FROM user'
  );

  console.log('Retrieved users:', users);

  return !!user;
};


export const storeUser = async ( { email, fullname, accessToken }: { email: string, fullname: string, accessToken: string } ): Promise<void> => {
  const db = await dbPromise;

  // Update or insert the user with id = 1
  const { changes } = await db.runAsync(
    'INSERT OR REPLACE INTO user (id, email, fullname, accessToken) VALUES (?, ?, ?, ?)',
    [1, email, fullname, accessToken]
  );

  console.log('User stored with changes:', changes);
};

export const getUser = async (): Promise<User | null> => {
  const db = await dbPromise;
  const user = await db.getFirstAsync<User>(
    'SELECT id, accessToken, fullname, email FROM user WHERE id = 1'
  );
  return user;
};