set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_user_create()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.users (id, name, avatar)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.can_user_interact_with_message(p_message_id uuid, p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
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
 SECURITY DEFINER
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
 STABLE SECURITY DEFINER
AS $function$
  SELECT exists(select * from chats where (user1_id=p_user_id OR user2_id=p_user_id))
$function$
;

CREATE TRIGGER after_user_insert AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_user_create();


