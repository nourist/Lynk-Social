set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_popular_users(limit_n integer)
 RETURNS TABLE(user_id uuid, follower_count bigint)
 LANGUAGE sql
 STABLE
AS $function$
  select
    following_id as user_id,
    count(*) as follower_count
  from user_follows
  group by following_id
  order by follower_count desc
  limit limit_n;
$function$
;

CREATE OR REPLACE FUNCTION public.get_popular_users(limit_n integer, offset_n integer)
 RETURNS TABLE(user_id uuid, follower_count bigint, total_users bigint)
 LANGUAGE sql
 STABLE
AS $function$
  with agg as (
    select
      following_id,
      count(*) as follower_count
    from user_follows
    group by following_id
  ),
  counted as (
    select 
      *, 
      (select count(*) from agg) as total_users
    from agg
  )
  select
    following_id as user_id,
    follower_count,
    total_users
  from counted
  order by follower_count desc
  limit limit_n offset offset_n;
$function$
;


