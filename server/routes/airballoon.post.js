import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const body = await readBody(event);
  const { data, error } = await supabase
    .from("airballoons")
    .update(body)
    .eq("id", body.id)
    .select();
  if (error) console.log(error);
  useFlyAirBalloon(supabase, data[0]);
  return data[0];
});
