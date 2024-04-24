import * as SQLite from "expo-sqlite"


const database = SQLite.openDatabase("watchList.db")


export const drop_all = async () => {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`DROP TABLE movie`, [], () => console.log("Table dropped successfully"), error => console.log("Error dropping table: " + error.message))
    })
    database.transaction((tx) => {
      tx.executeSql(`DROP TABLE watchList`, [], () => console.log("Table dropped successfully"), error => console.log("Error dropping table: " + error.message))
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
        list_color TEXT,
        watched_list BOOLEAN
        );`, [], () => console.log("Table watchList created successfully"), error => console.log("Error creating table: " + error.message))
    });
    database.transaction((tx) => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS movie (
        id INTEGER PRIMARY KEY,
        watch_list INT,
        list_order INT,
        show_type TEXT,
        movie_key TEXT,
        movie_data TEXT,
        watched BOOLEAN,
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
  const data = await new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`SELECT ML.*, COUNT(M.id) AS "amount" FROM watchList AS ML LEFT JOIN movie AS M ON ML.id = M.watch_list GROUP BY ML.id;`, [], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
  
  const list = []
  data.rows._array.map(element => list.push({
    id: element.id,
    name: element.list_name,
    color: element.list_color,
    amount: element.amount
  }));
  return list
}

export const update_watchList = async (name, color, id) => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`UPDATE watchList set list_name = ?, list_color = ? WHERE id = ?;`, [name, color, id], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
}

export const update_movie_order = async (id, order) => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`UPDATE movie set list_order = ? WHERE id = ?;`, [order, id], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
}


export const delete_watchList = async (id) => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`DELETE FROM watchList WHERE id = ?`, [id], (_, result) => resolve(result), (_, error) => reject(error));
    });
    database.transaction((tx) => {
      tx.executeSql(`DELETE FROM movie WHERE watch_list = ?`, [id], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
}

export const fetch_movie = async (id) => {
  const data = await new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`SELECT * FROM movie WHERE watch_list = ? ORDER BY list_order ASC;`, [id], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });

  const list = []
  data.rows._array.map(element => list.push({
    id: element.id,
    movie_data: element.movie_data,
    watch_list: element.watch_list,
    list_order: element.list_order,
    show_type: element.show_type,
    movie_key: parseInt(element.movie_key)
  }))

  return list
}
export const store_movie = async (watch_list_id, movie_key, movie_data, show_type) => {
  const default_order = (await fetch_movie(watch_list_id)).length;
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`INSERT INTO movie (watch_list, movie_data, list_order, movie_key, show_type, watched) VALUES (?, ?, ?, ?, ?, ?);`, [watch_list_id, movie_data, default_order, movie_key, show_type, false], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
}
export const check_if_movie_in_list = async (id, movie_key) => {
  const data = await new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`SELECT 1 FROM movie WHERE watch_list = ? AND movie_key = ?;`, [id, movie_key], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });

  return data.rows._array.length > 0
}
export const delete_movie = async (watch_list_id, movie_key) => {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(`DELETE FROM movie WHERE watch_list = ? AND movie_key = ?`, [watch_list_id, movie_key], (_, result) => resolve(result), (_, error) => reject(error));
    });
  });
}