import { createClient } from "@supabase/supabase-js";

export function getSupabase() {
  return createClient(
    "https://mdmswxsfdnxejhzpogay.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbXN3eHNmZG54ZWpoenBvZ2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzkzNTcwNDYsImV4cCI6MTk5NDkzMzA0Nn0.SGxH3yhVmEdbwqTYA8dSNM23VKH1xXeKD7fFxNZI2dI"
  );
}
