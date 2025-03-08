import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const fetchGroups = async (query: string) => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .ilike("name", `%${query}%`);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
};

export function useGetGroups(query: string) {
  return useQuery({
    queryKey: ["groups", { query }],
    queryFn: () => fetchGroups(query),
    staleTime: 10_000,
    placeholderData: (prev) => prev,
  });
}
