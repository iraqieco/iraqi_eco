const SUPABASE_URL = "https://rmqtopxawrrgntcqqnpa.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtcXRvcHhhd3JyZ250Y3FxbnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3OTIxMzQsImV4cCI6MjA5ODM2ODEzNH0.HoExHY9oNFdryWUC2u2UELLPfBNhH3P4L3zS03dvELA";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

window.supabase = supabase;
