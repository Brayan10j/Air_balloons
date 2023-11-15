import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const body = await readBody(event);
  const { data, error } = await supabase
    .from("airballoons")
    .insert(body.participants)
    .select();

  data.forEach((element) => {
    useFlyAirBalloon(supabase, element);
  });

  body.started = true;
  const res  = await supabase.from("tournaments").upsert(body).select();

  return res.data;
});
