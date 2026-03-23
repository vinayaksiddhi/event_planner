import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://mzvmtcqznenqlvchhouk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16dm10Y3F6bmVucWx2Y2hob3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzI0NTEsImV4cCI6MjA4OTg0ODQ1MX0.Ut7pah6-mF4z0S_UIDz5tlSqLrTmW9P0iMNRGJeKyCM"
);

export default supabase;