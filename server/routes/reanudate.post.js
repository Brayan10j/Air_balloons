import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const body = await readBody(event);
  await supabase.from("airballoons").update(body).eq("id", body.id);
  useFlyAirBalloon(supabase, body);
  return "xx";
});
