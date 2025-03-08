import { Tables } from "./supabase.types";

export type PostWithGroupAndUser = Tables<"posts"> & {
  user: Tables<"users">;
  group: Tables<"groups">;
};

export type Group = Tables<"groups">;
