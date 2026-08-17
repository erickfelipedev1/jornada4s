REVOKE ALL ON FUNCTION public.sync_site_analytics() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_site_analytics() TO postgres, service_role;