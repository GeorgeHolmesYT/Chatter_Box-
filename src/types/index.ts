export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
}

export interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  room_id: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  created_by: string;
}
