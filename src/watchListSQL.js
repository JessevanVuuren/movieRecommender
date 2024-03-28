import * as SQLite from "expo-sqlite"


const database = SQLite.openDatabase("watchList.db")


export const drop_all = async () => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`DROP TABLE movie`, [], () => console.log("Table created successfully"), error => console.log("Error creating table: " + error.message))
    })
    database.transaction((tx) => {
      tx.executeSql(`DROP TABLE watchList`, [], () => console.log("Table created successfully"), error => console.log("Error creating table: " + error.message))
    })
  });

  return promise;
}


export const initDatabase = async () => {
  return new Promise((res, rej) => {
    database.transaction((tx) => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS watchList (
        id INTEGER PRIMARY KEY,
        list_name TEXT,
        list_color TEXT
        );`, [], () => console.log("Table watchList created successfully"), error => console.log("Error creating table: " + error.message))
    });
    database.transaction((tx) => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS movie (
        id INTEGER PRIMARY KEY,
        watch_list INT,
        list_order INT,
        movie_key TEXT,
        FOREIGN KEY(watch_list) REFERENCES watchList(id)
        );`, [], () => console.log("Table movie created successfully"), error => console.log("Error creating table: " + error.message))
    });

    res()
  })
}

export const store_watchList = async (name, color) => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`INSERT INTO watchList (list_name, list_color) VALUES (?, ?)`, [name, color], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
}

export const fetch_watchList = async () => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`SELECT ML.*, COUNT(M.id) AS "amount" FROM watchList AS ML LEFT OUTER JOIN movie AS M ON ML.id = M.watch_list GROUP BY M.watch_list;`, [], (_, result) => resolve(result), (_, error) => reject(error));
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

export const fetch_movie = async (id) => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`SELECT * FROM movie WHERE watch_list = ?;`, [id], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
}
export const store_movie = async (watch_list_id, movie_key) => {
  const default_order = (await fetch_movie()).rows._array.length;
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`INSERT INTO movie (watch_list, list_order, movie_key) VALUES (?, ?, ?);`, [watch_list_id, default_order, movie_key], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
}