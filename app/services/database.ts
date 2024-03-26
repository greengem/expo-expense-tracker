import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('expense_tracker.db');

// Initialize the database
// Enhanced initDB with categories initialization
export const initDB = (): Promise<void> => {
  const defaultCategories = [
    { name: 'Food', color: 'red' },
    { name: 'Transportation', color: 'blue' },
    { name: 'Housing', color: 'green' },
    { name: 'Utilities', color: 'yellow' },
    { name: 'Entertainment', color: 'purple' }
  ];

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            category INTEGER NOT NULL,
            date TEXT NOT NULL,
            note TEXT,
            FOREIGN KEY (category) REFERENCES categories(id)
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
                tx.executeSql(`INSERT INTO categories (name, color) VALUES (?, ?);`, [category.name, category.color]);
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
export const addTransaction = (amount: number, categoryId: number, date: string, note?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO transactions (amount, category, date, note) VALUES (?, ?, ?, ?);`,
        [amount, categoryId, date, note || null],
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
    db.transaction(tx => {
      tx.executeSql(
        `SELECT transactions.*, categories.name AS categoryName FROM transactions
         INNER JOIN categories ON transactions.category = categories.id;`,
        [],
        (_, result) => {
          const transactions = result.rows._array;
          resolve(transactions);
        },
        (_, error) => {
          console.error("Error fetching transactions:", error);
          reject(error);
          return false;
        }
      );
    });
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

// Debug function to fetch and log all rows from the transactions table
export const debugFetchAllTransactions = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM transactions;`,
        [],
        (_, result) => {
          console.log("Debug - All Transactions Rows:", result.rows._array);
          resolve();
        },
        (_, error) => {
          console.error("Error during debug fetch of all transactions:", error);
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
        (_, { rows }) => {
          // Handle null result explicitly
          const balance = rows._array[0].balance ?? 0;
          resolve(balance);
        },
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


// Add a new category with color to the database
export const addCategory = (name: string, color: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO categories (name, color) VALUES (?, ?);`,
        [name, color],
        () => resolve(),
        (_, error) => {
          console.error("Error adding category:", error);
          reject(error);
          return true; // returning true to indicate an error occurred
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

export const fetchTransactionsByDay = (date: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM transactions WHERE date(date) = date(?) ORDER BY date DESC;`,
        [date],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          console.error("Error fetching daily transactions:", error);
          reject(error);
          return false;
        }
      );
    });
  });
};


export const fetchTransactionsByMonth = (year: number, month: number): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM transactions WHERE strftime('%Y', date) = ? AND strftime('%m', date) = ? ORDER BY date DESC;`,
        [year.toString(), month.toString().padStart(2, '0')], // Ensure month is two digits
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          console.error("Error fetching monthly transactions:", error);
          reject(error);
          return false;
        }
      );
    });
  });
};


export const fetchTransactionsByYear = (year: number): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM transactions WHERE strftime('%Y', date) = ? ORDER BY date DESC;`,
        [year.toString()],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          console.error("Error fetching yearly transactions:", error);
          reject(error);
          return false;
        }
      );
    });
  });
};


export const deleteAllData = (): Promise<void> => {
  const defaultCategories = [
    { name: 'Food', color: 'red' },
    { name: 'Transportation', color: 'blue' },
    { name: 'Housing', color: 'green' },
    { name: 'Utilities', color: 'yellow' },
    { name: 'Entertainment', color: 'purple' }
  ];

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Drop the tables
      tx.executeSql(`DROP TABLE IF EXISTS transactions;`);
      tx.executeSql(`DROP TABLE IF EXISTS categories;`);

      // Recreate the transactions table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount REAL NOT NULL,
          category INTEGER NOT NULL,
          date TEXT NOT NULL,
          note TEXT,
          FOREIGN KEY (category) REFERENCES categories(id)
        );`
      );

      // Recreate the categories table with color column
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          color TEXT
        );`
      );

      // Insert default categories
      defaultCategories.forEach(({ name, color }) => {
        tx.executeSql(`INSERT INTO categories (name, color) VALUES (?, ?);`, [name, color]);
      });
      
    }, 
    error => {
      console.error("Error resetting database:", error);
      reject(error);
    }, 
    () => {
      console.log("All data deleted, tables reset, and default categories added successfully.");
      resolve();
    });
  });
};
