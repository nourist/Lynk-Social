set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_bookmarked_posts(p_user_id uuid, p_limit integer, p_offset integer)
 RETURNS TABLE(id uuid, title text, content text, image text, video text, created_at timestamp with time zone, author jsonb, is_liked boolean, like_count bigint, comment_count bigint, is_marked boolean, total_count integer)
 LANGUAGE sql
AS $function$
  with available_posts as (
    select p.*
    from posts p
    join user_mark_posts ump on ump.post_id = p.id
    where ump.user_id = p_user_id
  ),
  counted_posts as (
    select
      *,
      count(*) over() as total_count
    from available_posts
    order by created_at desc
    limit p_limit offset p_offset
  )
  select
    cp.id,
    cp.title,
    cp.content,
    cp.image,
    cp.video,
    cp.created_at,
    jsonb_build_object(
      'id', u.id,
      'name', u.name,
      'avatar', u.avatar,
      'bio', u.bio
    ) as author,
    exists (
      select 1
      from user_like_posts ulp
      where ulp.post_id = cp.id
        and ulp.user_id = p_user_id
    ) as is_liked,
    (select count(*) from user_like_posts ulp where ulp.post_id = cp.id) as like_count,
    (select count(*) from comments c where c.post_id = cp.id) as comment_count,
    true as is_marked,
    cp.total_count
  from counted_posts cp
  join users u on u.id = cp.author_id;
$function$
;


