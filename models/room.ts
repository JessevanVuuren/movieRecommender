export interface SEND {
  type:   string;
  method: string;
  key:    string;
  id:     string;
}

export interface CONNECTION {
  type:   string;
  method: string;
  key:    string;
}


interface payload {
  amount_of_users: number;
  wanted: Array<string>;
  unwanted: Array<string>;
  final_movie: string;
  key: string;
}

export interface ROOM {
  success: string;
  status: string;
  error: string;
  payload: payload;
}
