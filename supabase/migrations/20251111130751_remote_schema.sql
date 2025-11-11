drop trigger if exists "validate_message_fields" on "public"."messages";

drop policy "user_like_messages_insert_receiver" on "public"."user_like_messages";

drop policy "user_like_messages_select_receiver_sender" on "public"."user_like_messages";

alter table "public"."comments" drop constraint "comments_post_id_fkey";

alter table "public"."comments" drop constraint "comments_reply_comment_id_fkey";

alter table "public"."comments" drop constraint "comments_user_id_fkey";

alter table "public"."messages" drop constraint "messages_receiver_id_fkey";

alter table "public"."messages" drop constraint "messages_sender_id_fkey";

alter table "public"."posts" drop constraint "posts_author_id_fkey";

alter table "public"."user_follows" drop constraint "user_follows_follower_id_fkey";

alter table "public"."user_follows" drop constraint "user_follows_following_id_fkey";

alter table "public"."user_like_comments" drop constraint "user_like_comments_comment_id_fkey";

alter table "public"."user_like_comments" drop constraint "user_like_comments_user_id_fkey";

alter table "public"."user_like_messages" drop constraint "user_like_messages_message_id_fkey";

alter table "public"."user_like_messages" drop constraint "user_like_messages_user_id_fkey";

alter table "public"."user_like_posts" drop constraint "user_like_posts_post_id_fkey";

alter table "public"."user_like_posts" drop constraint "user_like_posts_user_id_fkey";

drop function if exists "public"."get_popular_users"(limit_n integer, offset_n integer);

alter table "public"."messages" alter column "type" set data type public.message_type using "type"::text::public.message_type;

alter table "public"."comments" add constraint "comments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_post_id_fkey";

alter table "public"."comments" add constraint "comments_reply_comment_id_fkey" FOREIGN KEY (reply_comment_id) REFERENCES public.comments(id) ON DELETE SET NULL not valid;

alter table "public"."comments" validate constraint "comments_reply_comment_id_fkey";

alter table "public"."comments" add constraint "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) not valid;

alter table "public"."comments" validate constraint "comments_user_id_fkey";

alter table "public"."messages" add constraint "messages_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES public.users(id) not valid;

alter table "public"."messages" validate constraint "messages_receiver_id_fkey";

alter table "public"."messages" add constraint "messages_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES public.users(id) not valid;

alter table "public"."messages" validate constraint "messages_sender_id_fkey";

alter table "public"."posts" add constraint "posts_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.users(id) not valid;

alter table "public"."posts" validate constraint "posts_author_id_fkey";

alter table "public"."user_follows" add constraint "user_follows_follower_id_fkey" FOREIGN KEY (follower_id) REFERENCES public.users(id) not valid;

alter table "public"."user_follows" validate constraint "user_follows_follower_id_fkey";

alter table "public"."user_follows" add constraint "user_follows_following_id_fkey" FOREIGN KEY (following_id) REFERENCES public.users(id) not valid;

alter table "public"."user_follows" validate constraint "user_follows_following_id_fkey";

alter table "public"."user_like_comments" add constraint "user_like_comments_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON DELETE CASCADE not valid;

alter table "public"."user_like_comments" validate constraint "user_like_comments_comment_id_fkey";

alter table "public"."user_like_comments" add constraint "user_like_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) not valid;

alter table "public"."user_like_comments" validate constraint "user_like_comments_user_id_fkey";

alter table "public"."user_like_messages" add constraint "user_like_messages_message_id_fkey" FOREIGN KEY (message_id) REFERENCES public.comments(id) ON DELETE CASCADE not valid;

alter table "public"."user_like_messages" validate constraint "user_like_messages_message_id_fkey";

alter table "public"."user_like_messages" add constraint "user_like_messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) not valid;

alter table "public"."user_like_messages" validate constraint "user_like_messages_user_id_fkey";

alter table "public"."user_like_posts" add constraint "user_like_posts_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."user_like_posts" validate constraint "user_like_posts_post_id_fkey";

alter table "public"."user_like_posts" add constraint "user_like_posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) not valid;

alter table "public"."user_like_posts" validate constraint "user_like_posts_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_popular_users(limit_n integer, offset_n integer)
 RETURNS TABLE(user_id uuid, name text, email text, avatar text, bio text, follower_count bigint, total_users bigint)
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
    u.bio,
    c.follower_count,
    c.total_users
FROM counted c
JOIN users u ON u.id = c.following_id
ORDER BY c.follower_count DESC
LIMIT limit_n OFFSET offset_n;
$function$
;


  create policy "user_like_messages_insert_receiver"
  on "public"."user_like_messages"
  as permissive
  for insert
  to authenticated
with check (((EXISTS ( SELECT messages.id,
    messages.created_at,
    messages.type,
    messages.content,
    messages.image,
    messages.video,
    messages.receiver_id,
    messages.sender_id
   FROM public.messages
  WHERE ((messages.id = user_like_messages.message_id) AND (messages.receiver_id = ( SELECT auth.uid() AS uid))))) AND (user_id = ( SELECT auth.uid() AS uid))));



  create policy "user_like_messages_select_receiver_sender"
  on "public"."user_like_messages"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT messages.id,
    messages.created_at,
    messages.type,
    messages.content,
    messages.image,
    messages.video,
    messages.receiver_id,
    messages.sender_id
   FROM public.messages
  WHERE ((messages.id = user_like_messages.message_id) AND ((messages.sender_id = ( SELECT auth.uid() AS uid)) OR (messages.receiver_id = ( SELECT auth.uid() AS uid)))))));


CREATE TRIGGER validate_message_fields BEFORE INSERT OR UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.check_message_fields();

drop trigger if exists "after_user_insert" on "auth"."users";

CREATE TRIGGER after_user_insert AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_user_create();


