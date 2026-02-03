import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "conversions.db";

export const getDb = async () => {
  return await SQLite.openDatabaseAsync(DATABASE_NAME);
};

export const initDb = async () => {
  const db = await getDb();
  // Create the conversions table if it doesn't exist
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
