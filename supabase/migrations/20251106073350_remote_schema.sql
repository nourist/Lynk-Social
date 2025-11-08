drop policy "chats_insert_auth" on "public"."chats";

drop policy "chats_select_members" on "public"."chats";

drop policy "messages_insert_members" on "public"."messages";

drop policy "messages_select_members" on "public"."messages";

drop policy "user_like_messages_insert_members" on "public"."user_like_messages";

drop policy "user_like_messages_select_members" on "public"."user_like_messages";

drop policy "user_like_messages_delete_self" on "public"."user_like_messages";

revoke delete on table "public"."chats" from "anon";

revoke insert on table "public"."chats" from "anon";

revoke references on table "public"."chats" from "anon";

revoke select on table "public"."chats" from "anon";

revoke trigger on table "public"."chats" from "anon";

revoke truncate on table "public"."chats" from "anon";

revoke update on table "public"."chats" from "anon";

revoke delete on table "public"."chats" from "authenticated";

revoke insert on table "public"."chats" from "authenticated";

revoke references on table "public"."chats" from "authenticated";

revoke select on table "public"."chats" from "authenticated";

revoke trigger on table "public"."chats" from "authenticated";

revoke truncate on table "public"."chats" from "authenticated";

revoke update on table "public"."chats" from "authenticated";

revoke delete on table "public"."chats" from "service_role";

revoke insert on table "public"."chats" from "service_role";

revoke references on table "public"."chats" from "service_role";

revoke select on table "public"."chats" from "service_role";

revoke trigger on table "public"."chats" from "service_role";

revoke truncate on table "public"."chats" from "service_role";

revoke update on table "public"."chats" from "service_role";

alter table "public"."chats" drop constraint "chats_user1_id_fkey";

alter table "public"."chats" drop constraint "chats_user2_id_fkey";

alter table "public"."chats" drop constraint "unique_users";

alter table "public"."messages" drop constraint "messages_chat_id_fkey";

drop function if exists "public"."can_user_interact_with_message"(p_message_id uuid, p_user_id uuid);

drop function if exists "public"."is_user_in_chat"(p_chat_id uuid, p_user_id uuid);

alter table "public"."chats" drop constraint "chats_pkey";

drop index if exists "public"."chats_pkey";

drop index if exists "public"."chats_user1_id_id_user2_id_idx";

drop index if exists "public"."unique_users";

drop index if exists "public"."messages_chat_id_sender_id_created_at_idx";

drop table "public"."chats";

alter table "public"."messages" drop column "chat_id";

alter table "public"."messages" add column "receiver_id" uuid not null;

CREATE INDEX messages_chat_id_sender_id_created_at_idx ON public.messages USING btree (receiver_id, sender_id, created_at);

alter table "public"."messages" add constraint "messages_receiver_id_fkey" FOREIGN KEY (receiver_id) REFERENCES public.users(id) not valid;

alter table "public"."messages" validate constraint "messages_receiver_id_fkey";


  create policy "messages_insert_auth"
  on "public"."messages"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = sender_id));



  create policy "messages_select_receiver_sender"
  on "public"."messages"
  as permissive
  for select
  to authenticated
using (((( SELECT auth.uid() AS uid) = sender_id) OR (( SELECT auth.uid() AS uid) = receiver_id)));



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



  create policy "user_like_messages_delete_self"
  on "public"."user_like_messages"
  as permissive
  for delete
  to authenticated
using ((user_id = ( SELECT auth.uid() AS uid)));



