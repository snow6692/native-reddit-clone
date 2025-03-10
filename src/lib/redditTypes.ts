import { Tables, TablesInsert } from "./supabase.types";

export type PostWithGroupAndUser = Tables<"posts"> & {
  user: Tables<"users">;
  group: Tables<"groups">;
  upvotes: number;
};

export type Group = Tables<"groups">;
