export interface AddMemberBody {
  projectId: string;
  usernameOrEmail: string;
}

export interface RemoveMemberBody {
  projectId: string;
  userId: number;
}

export interface ProjectMemberView {
  userId: number;
  username: string;
  email: string | null;
  joinedAt: Date;
}
