import * as SQLite from "expo-sqlite"


const database = SQLite.openDatabase("watchList.db")


export const drop_all = async () => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`DROP TABLE watchList`, [], () => console.log("Table created successfully"), error => console.log("Error creating table: " + error.message))
    })
  });

  return promise;
}

const execute_sql = (tx, string) => {

}

export const initDatabase = () => {
  database.transaction(tx => execute_sql(
    tx.executeSql(`CREATE TABLE IF NOT EXISTS watchList (
      id INTEGER PRIMARY KEY,
      list_name TEXT
      list_color TEXT
    );`, [], () => console.log("Table created successfully"), error => console.log("Error creating table: " + error.message)),

    tx.executeSql(`CREATE TABLE IF NOT EXISTS movie (
      id INTEGER PRIMARY KEY,
      watch_list INT
      list_order INT
      movie_key TEXT,
      FOREIGN KEY(watch_list) REFERENCES watchList(id)
    );`, [], () => console.log("Table created successfully"), error => console.log("Error creating table: " + error.message))
  ));
}

export const store_watchList = async (name) => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`INSERT INTO watchList (list_name) VALUES (?)`, [name], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
}

export const fetch_watchList = async () => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`SELECT * FROM watchList`, [], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
}

export const update_watchList = async () => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`SELECT * FROM watchList`, [], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
}

export const delete_watchList = async (id) => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`DELETE FROM watchList WHERE id = ?`, [id], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
}