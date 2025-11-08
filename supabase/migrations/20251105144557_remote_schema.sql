CREATE INDEX chats_user1_id_id_user2_id_idx ON public.chats USING btree (user1_id, id, user2_id);

CREATE INDEX comments_post_id_user_id_reply_comment_id_idx ON public.comments USING btree (post_id, user_id, reply_comment_id);

CREATE INDEX messages_chat_id_sender_id_created_at_idx ON public.messages USING btree (chat_id, sender_id, created_at);

CREATE INDEX posts_created_at_author_id_idx ON public.posts USING btree (created_at, author_id);

CREATE INDEX user_follows_follower_id_following_id_idx ON public.user_follows USING btree (follower_id, following_id);

CREATE INDEX user_like_comments_user_id_comment_id_idx ON public.user_like_comments USING btree (user_id, comment_id);

CREATE INDEX user_like_messages_user_id_message_id_idx ON public.user_like_messages USING btree (user_id, message_id);

CREATE INDEX user_like_posts_user_id_post_id_idx ON public.user_like_posts USING btree (user_id, post_id);

CREATE INDEX users_id_name_idx ON public.users USING btree (id, name);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.can_user_interact_with_message(p_message_id uuid, p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
  allowed boolean;
begin
  select true into allowed
  from messages m
  join chats c on m.chat_id = c.id
  where m.id = p_message_id
    and (c.user1_id = p_user_id or c.user2_id = p_user_id)
  limit 1;

  return coalesce(allowed, false);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.check_message_fields()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  -- text msg
  if new.type = 'text' then
    if (new.content is null) or (new.image is not null) or (new.video is not null) then
      raise exception 'Text message must have content and no image/video';
    end if;

  -- image msg
  elsif new.type = 'image' then
    if (new.image is null) or (new.content is not null) or (new.video is not null) then
      raise exception 'Image message must have image and no content/video';
    end if;

  -- video msg
  elsif new.type = 'video' then
    if (new.video is null) or (new.content is not null) or (new.image is not null) then
      raise exception 'Video message must have video and no content/image';
    end if;

  else
    raise exception 'Invalid message type %', new.type;
  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.is_user_in_chat(p_chat_id uuid, p_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  SELECT exists(select * from chats where (user1_id=p_user_id OR user2_id=p_user_id))
$function$
;


  create policy "chats_insert_auth"
  on "public"."chats"
  as permissive
  for insert
  to authenticated
with check ((((( SELECT auth.uid() AS uid) = user1_id) OR (( SELECT auth.uid() AS uid) = user2_id)) AND (user1_id < user2_id)));



  create policy "chats_select_members"
  on "public"."chats"
  as permissive
  for select
  to authenticated
using (public.is_user_in_chat(( SELECT auth.uid() AS uid), id));



  create policy "comments_delete_self"
  on "public"."comments"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "comments_insert_auth"
  on "public"."comments"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "comments_select_all"
  on "public"."comments"
  as permissive
  for select
  to public
using (true);



  create policy "comments_update_self"
  on "public"."comments"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "messages_delete_self"
  on "public"."messages"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = sender_id));



  create policy "messages_insert_members"
  on "public"."messages"
  as permissive
  for insert
  to authenticated
with check (((( SELECT auth.uid() AS uid) = sender_id) AND public.is_user_in_chat(( SELECT auth.uid() AS uid), chat_id)));



  create policy "messages_select_members"
  on "public"."messages"
  as permissive
  for select
  to authenticated
using (public.is_user_in_chat(( SELECT auth.uid() AS uid), chat_id));



  create policy "messages_update_self"
  on "public"."messages"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = sender_id))
with check ((( SELECT auth.uid() AS uid) = sender_id));



  create policy "posts_delete_self"
  on "public"."posts"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = author_id));



  create policy "posts_insert_auth"
  on "public"."posts"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = author_id));



  create policy "posts_select_all"
  on "public"."posts"
  as permissive
  for select
  to public
using (true);



  create policy "posts_update_self"
  on "public"."posts"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = author_id))
with check ((( SELECT auth.uid() AS uid) = author_id));



  create policy "user_follows_delete_self"
  on "public"."user_follows"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = follower_id));



  create policy "user_follows_insert_auth"
  on "public"."user_follows"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = follower_id));



  create policy "user_follows_select_all"
  on "public"."user_follows"
  as permissive
  for select
  to public
using (true);



  create policy "user_like_comments_delete_self"
  on "public"."user_like_comments"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "user_like_comments_insert_auth"
  on "public"."user_like_comments"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "user_like_comments_select_all"
  on "public"."user_like_comments"
  as permissive
  for select
  to public
using (true);



  create policy "user_like_messages_delete_self"
  on "public"."user_like_messages"
  as permissive
  for delete
  to authenticated
using ((public.can_user_interact_with_message(message_id, ( SELECT auth.uid() AS uid)) AND (user_id = ( SELECT auth.uid() AS uid))));



  create policy "user_like_messages_insert_members"
  on "public"."user_like_messages"
  as permissive
  for insert
  to authenticated
with check ((public.can_user_interact_with_message(message_id, ( SELECT auth.uid() AS uid)) AND (user_id = ( SELECT auth.uid() AS uid))));



  create policy "user_like_messages_select_members"
  on "public"."user_like_messages"
  as permissive
  for select
  to authenticated
using (public.can_user_interact_with_message(message_id, ( SELECT auth.uid() AS uid)));



  create policy "user_like_posts_delete_self"
  on "public"."user_like_posts"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "user_like_posts_insert_auth"
  on "public"."user_like_posts"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "user_like_posts_select_all"
  on "public"."user_like_posts"
  as permissive
  for select
  to public
using (true);



  create policy "users_select_all"
  on "public"."users"
  as permissive
  for select
  to public
using (true);



  create policy "users_update_self"
  on "public"."users"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));


CREATE TRIGGER validate_message_fields BEFORE INSERT OR UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.check_message_fields();


