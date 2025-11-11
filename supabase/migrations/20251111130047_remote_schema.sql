drop function if exists "public"."get_popular_users"(limit_n integer, offset_n integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_popular_users(limit_n integer, offset_n integer)
 RETURNS TABLE(user_id uuid, name text, email text, avatar text, follower_count bigint, total_users bigint)
 LANGUAGE sql
 STABLE
AS $function$
WITH agg AS (
    SELECT
        following_id,
        COUNT(*) AS follower_count
    FROM user_follows
    GROUP BY following_id
),
counted AS (
    SELECT 
        a.*,
        (SELECT COUNT(*) FROM agg) AS total_users
    FROM agg a
)
SELECT
    u.id AS user_id,
    u.name,
    u.id,
    u.avatar,
    c.follower_count,
    c.total_users
FROM counted c
JOIN users u ON u.id = c.following_id
ORDER BY c.follower_count DESC
LIMIT limit_n OFFSET offset_n;
$function$
;


