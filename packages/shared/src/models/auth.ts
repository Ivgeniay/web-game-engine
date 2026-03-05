export interface RegisterBody {
  username: string;
  password: string;
  email?: string;
}

export interface LoginBody {
  username: string;
  password: string;
}
