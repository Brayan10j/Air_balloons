import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event);
  const body = await readBody(event);
  const { data, error } = await supabase
    .from("airballoons")
    .upsert(body)
    .select();
  if (error) console.log(error);

  const res = useFlyAirBalloon( supabase , data[0])
  return data[0];
});
