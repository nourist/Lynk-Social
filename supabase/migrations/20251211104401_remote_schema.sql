
  create table "public"."user_mark_posts" (
    "user_id" uuid not null default auth.uid(),
    "post_id" uuid not null
      );


alter table "public"."user_mark_posts" enable row level security;

CREATE UNIQUE INDEX user_mark_posts_pkey ON public.user_mark_posts USING btree (user_id, post_id);

CREATE INDEX user_mark_posts_user_id_post_id_idx ON public.user_mark_posts USING btree (user_id, post_id);

alter table "public"."user_mark_posts" add constraint "user_mark_posts_pkey" PRIMARY KEY using index "user_mark_posts_pkey";

alter table "public"."user_mark_posts" add constraint "user_mark_posts_post_id_fkey" FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE not valid;

alter table "public"."user_mark_posts" validate constraint "user_mark_posts_post_id_fkey";

alter table "public"."user_mark_posts" add constraint "user_mark_posts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) not valid;

alter table "public"."user_mark_posts" validate constraint "user_mark_posts_user_id_fkey";

grant delete on table "public"."user_mark_posts" to "anon";

grant insert on table "public"."user_mark_posts" to "anon";

grant references on table "public"."user_mark_posts" to "anon";

grant select on table "public"."user_mark_posts" to "anon";

grant trigger on table "public"."user_mark_posts" to "anon";

grant truncate on table "public"."user_mark_posts" to "anon";

grant update on table "public"."user_mark_posts" to "anon";

grant delete on table "public"."user_mark_posts" to "authenticated";

grant insert on table "public"."user_mark_posts" to "authenticated";

grant references on table "public"."user_mark_posts" to "authenticated";

grant select on table "public"."user_mark_posts" to "authenticated";

grant trigger on table "public"."user_mark_posts" to "authenticated";

grant truncate on table "public"."user_mark_posts" to "authenticated";

grant update on table "public"."user_mark_posts" to "authenticated";

grant delete on table "public"."user_mark_posts" to "service_role";

grant insert on table "public"."user_mark_posts" to "service_role";

grant references on table "public"."user_mark_posts" to "service_role";

grant select on table "public"."user_mark_posts" to "service_role";

grant trigger on table "public"."user_mark_posts" to "service_role";

grant truncate on table "public"."user_mark_posts" to "service_role";

grant update on table "public"."user_mark_posts" to "service_role";


  create policy "user_mark_posts_all_self"
  on "public"."user_mark_posts"
  as permissive
  for all
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



