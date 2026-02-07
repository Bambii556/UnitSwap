import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "conversions.db";
let _db: SQLite.SQLiteDatabase | null = null; // Declare a module-level variable to hold the database instance
let _dbPromise: Promise<SQLite.SQLiteDatabase> | null = null; // Promise to hold the database opening operation

export const getDb = async () => {
  console.log(
    "getDb called. Current _db: ",
    _db ? "initialized" : "null",
    ", _dbPromise: ",
    _dbPromise ? "pending/resolved" : "null",
  );

  if (_db) {
    return _db;
  }

  if (!_dbPromise) {
    console.log("Initiating database opening: ", DATABASE_NAME);
    _dbPromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  _db = await _dbPromise;
  console.log(
    "Database opened (or retrieved). _db: ",
    _db ? "initialized" : "null",
  );
  return _db;
};

export const initDb = async () => {
  console.log("initDb called.");
  const db = await getDb();
  console.log("initDb: Database instance obtained. Executing CREATE TABLE...");
  // Create the conversions table if it doesn&#x27;t exist
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS conversions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      inputValue REAL NOT NULL,
      outputValue REAL NOT NULL,
      originalUnit TEXT NOT NULL,
      convertedUnit TEXT NOT NULL,
      conversionType TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    );`,
  );
  console.log("initDb: CREATE TABLE command executed.");
};

export interface Conversion {
  id?: number; // Add optional id for retrieved conversions
  inputValue: number;
  outputValue: number;
  originalUnit: string;
  convertedUnit: string;
  conversionType: string;
  timestamp: number;
}

export const getConversions = async (
  limit?: number,
  offset?: number,
  conversionType?: string,
): Promise<Conversion[]> => {
  const db = await getDb();
  let query = `SELECT * FROM conversions`;
  const params: (string | number)[] = [];

  if (conversionType) {
    query += ` WHERE conversionType = ?`;
    params.push(conversionType);
  }

  query += ` ORDER BY timestamp DESC`;

  if (limit !== undefined) {
    query += ` LIMIT ?`;
    params.push(limit);
  }

  if (offset !== undefined) {
    query += ` OFFSET ?`;
    params.push(offset);
  }

  const allRows = await db.getAllAsync<Conversion>(query + `;`, params);
  return allRows;
};

export const saveConversion = async (conversion: Conversion) => {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO conversions (inputValue, outputValue, originalUnit, convertedUnit, conversionType, timestamp)
     VALUES (?, ?, ?, ?, ?, ?);`,
    [
      conversion.inputValue,
      conversion.outputValue,
      conversion.originalUnit,
      conversion.convertedUnit,
      conversion.conversionType,
      conversion.timestamp,
    ],
  );
};

export const searchConversions = async (
  searchTerm: string,
  limit?: number,
  offset?: number,
  conversionType?: string,
): Promise<Conversion[]> => {
  const db = await getDb();
  let query = `
    SELECT * FROM conversions
    WHERE originalUnit LIKE ? OR convertedUnit LIKE ? OR conversionType LIKE ?
  `;
  const params: (string | number)[] = [
    `%${searchTerm}%`,
    `%${searchTerm}%`,
    `%${searchTerm}%`,
  ];

  if (conversionType) {
    query += ` AND conversionType = ?`;
    params.push(conversionType);
  }

  query += ` ORDER BY timestamp DESC`;

  if (limit !== undefined) {
    query += ` LIMIT ?`;
    params.push(limit);
  }

  if (offset !== undefined) {
    query += ` OFFSET ?`;
    params.push(offset);
  }

  const allRows = await db.getAllAsync<Conversion>(query + ";", params);
  return allRows;
};

export const clearAllConversions = async () => {
  const db = await getDb();
  await db.runAsync(`DELETE FROM conversions;`);
  console.log("All conversions cleared from database.");
};
