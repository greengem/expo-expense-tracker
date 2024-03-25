import * as SQLite from 'expo-sqlite';
import { SQLError } from 'expo-sqlite';

const db = SQLite.openDatabase('expense_tracker.db');

// Initialize the database
export const initDB = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            note TEXT
          );`
        );
      },
      error => {
        console.error("Error initializing database:", error);
        reject(error);
        return false;
      },
      () => {
        console.log("Database initialized successfully");
        resolve();
      }
    );
  });
};

// Add a transaction to the database
export const addTransaction = (amount: number, category: string, date: string, note?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO transactions (amount, category, date, note) VALUES (?, ?, ?, ?);`,
        [amount, category, date, note || null],
        () => resolve(),
        (_, error) => {
          console.error("Error adding transaction:", error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Fetch all transactions from the database
export const fetchTransactions = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `SELECT * FROM transactions;`,
          [],
          (_, { rows: { _array } }) => resolve(_array),
          (_, error) => {
            console.error("Error fetching transactions:", error);
            reject(error);
            return false;
          }
        );
      }
    );
  });
};

// Delete a transaction from the database
export const deleteTransaction = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM transactions WHERE id = ?;`,
        [id],
        () => resolve(),
        (_, error) => {
          console.error("Error deleting transaction:", error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Fetch the current balance from the database
export const fetchCurrentBalance = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT SUM(amount) AS balance FROM transactions;`,
        [],
        (_, { rows }) => resolve(rows._array[0].balance),
        (_, error) => {
          console.error("Error fetching current balance:", error);
          reject(error);
          return false;
        }
      );
    });
  });
};
