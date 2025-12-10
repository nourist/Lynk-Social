set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_mutual_friends_with_last_message(p_user_id uuid)
 RETURNS TABLE(friend_id uuid, friend_name text, friend_avatar text, friend_bio text, friend_thumbnail text, last_message_id uuid, last_message_content text, last_message_created_at timestamp with time zone, last_message_sender_id uuid, last_message_receiver_id uuid, last_message_type public.message_type, last_message_image text, last_message_video text)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
with followings as (
  select following_id as uid from user_follows where follower_id = p_user_id
),
followers as (
  select follower_id as uid from user_follows where following_id = p_user_id
),
mutuals as (
  select f.uid from followings f
  inner join followers r on r.uid = f.uid
),
last_msgs as (
  select distinct on (counterpart_id)
    m.id as last_message_id,
    m.content as last_message_content,
    m.created_at as last_message_created_at,
    m.sender_id as last_message_sender_id,
    m.receiver_id as last_message_receiver_id,
    m.type as last_message_type,
    m.image as last_message_image,
    m.video as last_message_video,
    case
      when m.sender_id = p_user_id then m.receiver_id
      else m.sender_id
    end as counterpart_id
  from messages m
  where m.sender_id = p_user_id or m.receiver_id = p_user_id
  order by counterpart_id, m.created_at desc
)
select
  u.id as friend_id,
  u.name as friend_name,
  u.avatar as friend_avatar,
  u.bio as friend_bio,
  u.thumbnail as friend_thumbnail,
  l.last_message_id,
  l.last_message_content,
  l.last_message_created_at,
  l.last_message_sender_id,
  l.last_message_receiver_id,
  l.last_message_type,
  l.last_message_image,
  l.last_message_video
from mutuals m
join users u on u.id = m.uid
left join last_msgs l on l.counterpart_id = u.id
order by u.name nulls last;
$function$
;


