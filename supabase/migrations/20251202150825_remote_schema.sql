drop function if exists "public"."get_home_posts"(p_user_id uuid, p_limit integer, p_offset integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_explore_posts(p_user_id uuid DEFAULT NULL::uuid, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, title text, content text, image text, video text, created_at timestamp with time zone, author jsonb, is_liked boolean)
 LANGUAGE sql
AS $function$
    select
        p.id,
        p.title,
        p.content,
        p.image,
        p.video,
        p.created_at,
        row_to_json(u.*) as author,
        exists (
            select 1
            from user_like_posts ulp
            where ulp.post_id = p.id
              and (p_user_id is null or ulp.user_id = p_user_id)
        ) as is_liked
    from posts p
    join users u on u.id = p.author_id
    order by p.created_at desc
    limit p_limit offset p_offset;
$function$
;

CREATE OR REPLACE FUNCTION public.get_home_posts(p_user_id uuid, p_limit integer, p_offset integer)
 RETURNS TABLE(id uuid, title text, content text, image text, video text, created_at timestamp with time zone, author jsonb, is_liked boolean)
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
    ) as author,
    exists (
      select 1
      from user_like_posts ulp
      where ulp.post_id = p.id
        and ulp.user_id = p_user_id
    ) as is_liked
  from posts p
  join users u on u.id = p.author_id
  left join user_follows f
    on f.following_id = p.author_id
   and f.follower_id = p_user_id
  where
    p.author_id = p_user_id
    or f.follower_id is not null
  order by p.created_at desc
  limit p_limit offset p_offset;
$function$
;


