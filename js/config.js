
const SUPABASE_URL = "https://rmqtopxawrrgntcqqnpa.supabase.co";

const SUPABASE_KEY = "sb_publishable_M1Adw5Xf9Sq-aCSREHP6uQ_5Geps_QX";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

window.supabase = supabase;
