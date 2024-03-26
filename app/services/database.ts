import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('expense_tracker.db');

// Initialize the database
// Enhanced initDB with categories initialization
export const initDB = (): Promise<void> => {
  const defaultCategories = ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment'];

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // Create the transactions table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            note TEXT
          );`
        );

        // Create the categories table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
          );`
        );

        // Check if the categories table is empty and insert default categories if it is
        tx.executeSql(
          `SELECT COUNT(id) as count FROM categories;`,
          [],
          (_, { rows }) => {
            if (rows._array[0].count === 0) {
              defaultCategories.forEach(category => {
                tx.executeSql(`INSERT INTO categories (name) VALUES (?);`, [category]);
              });
            }
          }
        );
      },
      error => {
        console.error("Error initializing database:", error);
        reject(error);
        return false;
      },
      () => {
        console.log("Database and default categories initialized successfully");
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

// Fetch all categories from the database
export const fetchCategories = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `SELECT * FROM categories ORDER BY name;`, // Order by name for a consistent display order
          [],
          (_, result) => {
            const categories = result.rows._array;
            resolve(categories);
          },
          (_, error) => {
            console.error("Error fetching categories:", error);
            reject(error);
            return false;
          }
        );
      }
    );
  });
};


// Add a new category to the database
export const addCategory = (name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO categories (name) VALUES (?);`,
        [name],
        () => resolve(),
        (_, error) => {
          console.error("Error adding category:", error);
          reject(error);
          return false;
        }
      );
    });
  });
};

// Delete a category from the database
export const deleteCategory = (name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM categories WHERE name = ?;`,
        [name],
        () => resolve(),
        (_, error) => {
          console.error("Error deleting category:", error);
          reject(error);
          return false;
        }
      );
    });
  });
};
