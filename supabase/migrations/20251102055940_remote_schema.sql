drop extension if exists "pg_net";

create type "public"."message_type" as enum ('text', 'image', 'video');


  create table "public"."chats" (
    "id" uuid not null default gen_random_uuid(),
    "user1_id" uuid not null,
    "user2_id" uuid not null
      );


alter table "public"."chats" enable row level security;


  create table "public"."comments" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "post_id" uuid not null,
    "user_id" uuid not null default auth.uid(),
    "content" text not null,
    "reply_comment_id" uuid
      );


alter table "public"."comments" enable row level security;


  create table "public"."messages" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "type" public.message_type not null,
    "content" text,
    "image" text,
    "video" text,
    "chat_id" uuid not null,
    "sender_id" uuid not null default auth.uid()
      );


alter table "public"."messages" enable row level security;


  create table "public"."posts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "title" text not null,
    "content" text,
    "image" text,
    "author_id" uuid not null default auth.uid(),
    "video" text
      );


alter table "public"."posts" enable row level security;


  create table "public"."user_follows" (
    "follower_id" uuid not null default auth.uid(),
    "following_id" uuid not null
      );


alter table "public"."user_follows" enable row level security;


  create table "public"."user_like_comments" (
    "user_id" uuid not null default auth.uid(),
    "comment_id" uuid not null
      );


alter table "public"."user_like_comments" enable row level security;


  create table "public"."user_like_messages" (
    "user_id" uuid not null default auth.uid(),
    "message_id" uuid not null
      );


alter table "public"."user_like_messages" enable row level security;


  create table "public"."user_like_posts" (
    "user_id" uuid not null default auth.uid(),
    "post_id" uuid not null
      );


alter table "public"."user_like_posts" enable row level security;


  create table "public"."users" (
    "id" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null default ''::text,
    "avatar" text,
    "thumbnail" text,
    "bio" text not null default ''::text
      );


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX chats_pkey ON public.chats USING btree (id);

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX unique_users ON public.chats USING btree (user1_id, user2_id);

CREATE UNIQUE INDEX user_follows_pkey ON public.user_follows USING btree (follower_id, following_id);

CREATE UNIQUE INDEX user_like_comments_pkey ON public.user_like_comments USING btree (user_id, comment_id);

CREATE UNIQUE INDEX user_like_messages_pkey ON public.user_like_messages USING btree (user_id, message_id);

CREATE UNIQUE INDEX user_like_posts_pkey ON public.user_like_posts USING btree (user_id, post_id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."chats" add constraint "chats_pkey" PRIMARY KEY using index "chats_pkey";

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."user_follows" add constraint "user_follows_pkey" PRIMARY KEY using index "user_follows_pkey";

alter table "public"."user_like_comments" add constraint "user_like_comments_pkey" PRIMARY KEY using index "user_like_comments_pkey";

alter table "public"."user_like_messages" add constraint "user_like_messages_pkey" PRIMARY KEY using index "user_like_messages_pkey";

alter table "public"."user_like_posts" add constraint "user_like_posts_pkey" PRIMARY KEY using index "user_like_posts_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."chats" add constraint "chats_user1_id_fkey" FOREIGN KEY (user1_id) REFERENCES public.users(id) not valid;

alter table "public"."chats" validate constraint "chats_user1_id_fkey";

alter table "public"."chats" add constraint "chats_user2_id_fkey" FOREIGN KEY (user2_id) REFERENCES public.users(id) not valid;

alter table "public"."chats" validate constraint "chats_user2_id_fkey";

alter table "public"."chats" add constraint "unique_users" UNIQUE using index "unique_users";

alter table "public"."comments" add constraint "comments_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_post_id_fkey";

alter table "public"."comments" add constraint "comments_reply_comment_id_fkey" FOREIGN KEY (reply_comment_id) REFERENCES public.comments(id) ON DELETE SET NULL not valid;

alter table "public"."comments" validate constraint "comments_reply_comment_id_fkey";

alter table "public"."comments" add constraint "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) not valid;

alter table "public"."comments" validate constraint "comments_user_id_fkey";

alter table "public"."messages" add constraint "messages_chat_id_fkey" FOREIGN KEY (chat_id) REFERENCES public.chats(id) not valid;

alter table "public"."messages" validate constraint "messages_chat_id_fkey";

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

grant delete on table "public"."chats" to "anon";

grant insert on table "public"."chats" to "anon";

grant references on table "public"."chats" to "anon";

grant select on table "public"."chats" to "anon";

grant trigger on table "public"."chats" to "anon";

grant truncate on table "public"."chats" to "anon";

grant update on table "public"."chats" to "anon";

grant delete on table "public"."chats" to "authenticated";

grant insert on table "public"."chats" to "authenticated";

grant references on table "public"."chats" to "authenticated";

grant select on table "public"."chats" to "authenticated";

grant trigger on table "public"."chats" to "authenticated";

grant truncate on table "public"."chats" to "authenticated";

grant update on table "public"."chats" to "authenticated";

grant delete on table "public"."chats" to "service_role";

grant insert on table "public"."chats" to "service_role";

grant references on table "public"."chats" to "service_role";

grant select on table "public"."chats" to "service_role";

grant trigger on table "public"."chats" to "service_role";

grant truncate on table "public"."chats" to "service_role";

grant update on table "public"."chats" to "service_role";

grant delete on table "public"."comments" to "anon";

grant insert on table "public"."comments" to "anon";

grant references on table "public"."comments" to "anon";

grant select on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant update on table "public"."comments" to "anon";

grant delete on table "public"."comments" to "authenticated";

grant insert on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "authenticated";

grant select on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant update on table "public"."comments" to "authenticated";

grant delete on table "public"."comments" to "service_role";

grant insert on table "public"."comments" to "service_role";

grant references on table "public"."comments" to "service_role";

grant select on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant update on table "public"."comments" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

grant delete on table "public"."user_follows" to "anon";

grant insert on table "public"."user_follows" to "anon";

grant references on table "public"."user_follows" to "anon";

grant select on table "public"."user_follows" to "anon";

grant trigger on table "public"."user_follows" to "anon";

grant truncate on table "public"."user_follows" to "anon";

grant update on table "public"."user_follows" to "anon";

grant delete on table "public"."user_follows" to "authenticated";

grant insert on table "public"."user_follows" to "authenticated";

grant references on table "public"."user_follows" to "authenticated";

grant select on table "public"."user_follows" to "authenticated";

grant trigger on table "public"."user_follows" to "authenticated";

grant truncate on table "public"."user_follows" to "authenticated";

grant update on table "public"."user_follows" to "authenticated";

grant delete on table "public"."user_follows" to "service_role";

grant insert on table "public"."user_follows" to "service_role";

grant references on table "public"."user_follows" to "service_role";

grant select on table "public"."user_follows" to "service_role";

grant trigger on table "public"."user_follows" to "service_role";

grant truncate on table "public"."user_follows" to "service_role";

grant update on table "public"."user_follows" to "service_role";

grant delete on table "public"."user_like_comments" to "anon";

grant insert on table "public"."user_like_comments" to "anon";

grant references on table "public"."user_like_comments" to "anon";

grant select on table "public"."user_like_comments" to "anon";

grant trigger on table "public"."user_like_comments" to "anon";

grant truncate on table "public"."user_like_comments" to "anon";

grant update on table "public"."user_like_comments" to "anon";

grant delete on table "public"."user_like_comments" to "authenticated";

grant insert on table "public"."user_like_comments" to "authenticated";

grant references on table "public"."user_like_comments" to "authenticated";

grant select on table "public"."user_like_comments" to "authenticated";

grant trigger on table "public"."user_like_comments" to "authenticated";

grant truncate on table "public"."user_like_comments" to "authenticated";

grant update on table "public"."user_like_comments" to "authenticated";

grant delete on table "public"."user_like_comments" to "service_role";

grant insert on table "public"."user_like_comments" to "service_role";

grant references on table "public"."user_like_comments" to "service_role";

grant select on table "public"."user_like_comments" to "service_role";

grant trigger on table "public"."user_like_comments" to "service_role";

grant truncate on table "public"."user_like_comments" to "service_role";

grant update on table "public"."user_like_comments" to "service_role";

grant delete on table "public"."user_like_messages" to "anon";

grant insert on table "public"."user_like_messages" to "anon";

grant references on table "public"."user_like_messages" to "anon";

grant select on table "public"."user_like_messages" to "anon";

grant trigger on table "public"."user_like_messages" to "anon";

grant truncate on table "public"."user_like_messages" to "anon";

grant update on table "public"."user_like_messages" to "anon";

grant delete on table "public"."user_like_messages" to "authenticated";

grant insert on table "public"."user_like_messages" to "authenticated";

grant references on table "public"."user_like_messages" to "authenticated";

grant select on table "public"."user_like_messages" to "authenticated";

grant trigger on table "public"."user_like_messages" to "authenticated";

grant truncate on table "public"."user_like_messages" to "authenticated";

grant update on table "public"."user_like_messages" to "authenticated";

grant delete on table "public"."user_like_messages" to "service_role";

grant insert on table "public"."user_like_messages" to "service_role";

grant references on table "public"."user_like_messages" to "service_role";

grant select on table "public"."user_like_messages" to "service_role";

grant trigger on table "public"."user_like_messages" to "service_role";

grant truncate on table "public"."user_like_messages" to "service_role";

grant update on table "public"."user_like_messages" to "service_role";

grant delete on table "public"."user_like_posts" to "anon";

grant insert on table "public"."user_like_posts" to "anon";

grant references on table "public"."user_like_posts" to "anon";

grant select on table "public"."user_like_posts" to "anon";

grant trigger on table "public"."user_like_posts" to "anon";

grant truncate on table "public"."user_like_posts" to "anon";

grant update on table "public"."user_like_posts" to "anon";

grant delete on table "public"."user_like_posts" to "authenticated";

grant insert on table "public"."user_like_posts" to "authenticated";

grant references on table "public"."user_like_posts" to "authenticated";

grant select on table "public"."user_like_posts" to "authenticated";

grant trigger on table "public"."user_like_posts" to "authenticated";

grant truncate on table "public"."user_like_posts" to "authenticated";

grant update on table "public"."user_like_posts" to "authenticated";

grant delete on table "public"."user_like_posts" to "service_role";

grant insert on table "public"."user_like_posts" to "service_role";

grant references on table "public"."user_like_posts" to "service_role";

grant select on table "public"."user_like_posts" to "service_role";

grant trigger on table "public"."user_like_posts" to "service_role";

grant truncate on table "public"."user_like_posts" to "service_role";

grant update on table "public"."user_like_posts" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


