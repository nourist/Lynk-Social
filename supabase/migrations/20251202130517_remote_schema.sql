drop policy "user_follows_insert_auth" on "public"."user_follows";

drop function if exists "public"."get_popular_users"(limit_n integer);

alter table "public"."user_follows" add column "created_at" timestamp with time zone not null default now();

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_home_posts(p_user_id uuid, p_limit integer, p_offset integer)
 RETURNS TABLE(id uuid, title text, content text, image text, video text, created_at timestamp with time zone, author jsonb)
 LANGUAGE sql
AS $function$
  select
    p.id,
    p.title,
    p.content,
    p.image,
    p.video,
    p.created_at,
    jsonb_build_object(
      'id', u.id,
      'name', u.name,
      'avatar', u.avatar,
      'bio', u.bio
    ) as author
  from posts p
  join user_follows f on f.following_id = p.author_id
  join users u on u.id = p.author_id
  where f.follower_id = p_user_id
  order by p.created_at desc
  limit p_limit offset p_offset;
$function$
;

CREATE OR REPLACE FUNCTION public.get_popular_users(limit_n integer, offset_n integer)
 RETURNS TABLE(user_id uuid, name text, email text, avatar text, bio text, follower_count bigint, total_users bigint)
 LANGUAGE sql
 STABLE
AS $function$WITH agg AS ( SELECT following_id, COUNT(*) AS follower_count FROM user_follows GROUP BY following_id ), counted AS ( SELECT a.*, (SELECT COUNT(*) FROM agg) AS total_users FROM agg a ) SELECT u.id AS user_id, u.name, u.id, u.avatar, u.bio, c.follower_count, c.total_users FROM counted c JOIN users u ON u.id = c.following_id ORDER BY c.follower_count DESC LIMIT limit_n OFFSET offset_n;$function$
;


  create policy "user_follows_insert_auth"
  on "public"."user_follows"
  as permissive
  for insert
  to authenticated
with check (((( SELECT auth.uid() AS uid) = follower_id) AND (follower_id <> following_id)));



  create policy "insert_by_auth 1ffg0oo_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'images'::text));



  create policy "insert_by_auth 1livt5k_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'videos'::text));



