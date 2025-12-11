export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: '13.0.5';
	};
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					extensions?: Json;
					operationName?: string;
					query?: string;
					variables?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			comments: {
				Row: {
					content: string;
					created_at: string;
					id: string;
					post_id: string;
					reply_comment_id: string | null;
					user_id: string;
				};
				Insert: {
					content: string;
					created_at?: string;
					id?: string;
					post_id: string;
					reply_comment_id?: string | null;
					user_id?: string;
				};
				Update: {
					content?: string;
					created_at?: string;
					id?: string;
					post_id?: string;
					reply_comment_id?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'comments_post_id_fkey';
						columns: ['post_id'];
						isOneToOne: false;
						referencedRelation: 'posts';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'comments_reply_comment_id_fkey';
						columns: ['reply_comment_id'];
						isOneToOne: false;
						referencedRelation: 'comments';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'comments_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
			messages: {
				Row: {
					content: string | null;
					created_at: string;
					id: string;
					image: string | null;
					receiver_id: string;
					sender_id: string;
					type: Database['public']['Enums']['message_type'];
					video: string | null;
				};
				Insert: {
					content?: string | null;
					created_at?: string;
					id?: string;
					image?: string | null;
					receiver_id: string;
					sender_id?: string;
					type: Database['public']['Enums']['message_type'];
					video?: string | null;
				};
				Update: {
					content?: string | null;
					created_at?: string;
					id?: string;
					image?: string | null;
					receiver_id?: string;
					sender_id?: string;
					type?: Database['public']['Enums']['message_type'];
					video?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'messages_receiver_id_fkey';
						columns: ['receiver_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'messages_sender_id_fkey';
						columns: ['sender_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
			posts: {
				Row: {
					author_id: string;
					content: string | null;
					created_at: string;
					id: string;
					image: string | null;
					title: string;
					video: string | null;
				};
				Insert: {
					author_id?: string;
					content?: string | null;
					created_at?: string;
					id?: string;
					image?: string | null;
					title: string;
					video?: string | null;
				};
				Update: {
					author_id?: string;
					content?: string | null;
					created_at?: string;
					id?: string;
					image?: string | null;
					title?: string;
					video?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'posts_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
			user_follows: {
				Row: {
					created_at: string;
					follower_id: string;
					following_id: string;
				};
				Insert: {
					created_at?: string;
					follower_id?: string;
					following_id: string;
				};
				Update: {
					created_at?: string;
					follower_id?: string;
					following_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_follows_follower_id_fkey';
						columns: ['follower_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'user_follows_following_id_fkey';
						columns: ['following_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
			user_like_comments: {
				Row: {
					comment_id: string;
					user_id: string;
				};
				Insert: {
					comment_id: string;
					user_id?: string;
				};
				Update: {
					comment_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_like_comments_comment_id_fkey';
						columns: ['comment_id'];
						isOneToOne: false;
						referencedRelation: 'comments';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'user_like_comments_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
			user_like_messages: {
				Row: {
					message_id: string;
					user_id: string;
				};
				Insert: {
					message_id: string;
					user_id?: string;
				};
				Update: {
					message_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_like_messages_message_id_fkey';
						columns: ['message_id'];
						isOneToOne: false;
						referencedRelation: 'comments';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'user_like_messages_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
			user_like_posts: {
				Row: {
					post_id: string;
					user_id: string;
				};
				Insert: {
					post_id: string;
					user_id?: string;
				};
				Update: {
					post_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_like_posts_post_id_fkey';
						columns: ['post_id'];
						isOneToOne: false;
						referencedRelation: 'posts';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'user_like_posts_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
			user_mark_posts: {
				Row: {
					post_id: string;
					user_id: string;
				};
				Insert: {
					post_id: string;
					user_id?: string;
				};
				Update: {
					post_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_mark_posts_post_id_fkey';
						columns: ['post_id'];
						isOneToOne: false;
						referencedRelation: 'posts';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'user_mark_posts_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					},
				];
			};
			users: {
				Row: {
					avatar: string | null;
					bio: string;
					created_at: string;
					id: string;
					name: string;
					thumbnail: string | null;
				};
				Insert: {
					avatar?: string | null;
					bio?: string;
					created_at?: string;
					id?: string;
					name?: string;
					thumbnail?: string | null;
				};
				Update: {
					avatar?: string | null;
					bio?: string;
					created_at?: string;
					id?: string;
					name?: string;
					thumbnail?: string | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			get_bookmarked_posts: {
				Args: { p_limit: number; p_offset: number; p_user_id: string };
				Returns: {
					author: Json;
					comment_count: number;
					content: string;
					created_at: string;
					id: string;
					image: string;
					is_liked: boolean;
					is_marked: boolean;
					like_count: number;
					title: string;
					total_count: number;
					video: string;
				}[];
			};
			get_explore_posts: {
				Args: { p_limit: number; p_offset: number; p_user_id: string };
				Returns: {
					author: Json;
					comment_count: number;
					content: string;
					created_at: string;
					id: string;
					image: string;
					is_liked: boolean;
					is_marked: boolean;
					like_count: number;
					title: string;
					total_count: number;
					video: string;
				}[];
			};
			get_home_posts: {
				Args: { p_limit: number; p_offset: number; p_user_id: string };
				Returns: {
					author: Json;
					comment_count: number;
					content: string;
					created_at: string;
					id: string;
					image: string;
					is_liked: boolean;
					is_marked: boolean;
					like_count: number;
					title: string;
					total_count: number;
					video: string;
				}[];
			};
			get_mutual_friends_with_last_message: {
				Args: { p_user_id: string };
				Returns: {
					friend_avatar: string;
					friend_bio: string;
					friend_id: string;
					friend_name: string;
					friend_thumbnail: string;
					last_message_content: string;
					last_message_created_at: string;
					last_message_id: string;
					last_message_image: string;
					last_message_receiver_id: string;
					last_message_sender_id: string;
					last_message_type: Database['public']['Enums']['message_type'];
					last_message_video: string;
				}[];
			};
			get_popular_users: {
				Args: { limit_n: number; offset_n: number };
				Returns: {
					avatar: string;
					bio: string;
					email: string;
					follower_count: number;
					name: string;
					total_users: number;
					user_id: string;
				}[];
			};
			get_user_posts: {
				Args: {
					p_current_user_id: string;
					p_limit: number;
					p_offset: number;
					p_target_user_id: string;
				};
				Returns: {
					author: Json;
					comment_count: number;
					content: string;
					created_at: string;
					id: string;
					image: string;
					is_liked: boolean;
					is_marked: boolean;
					like_count: number;
					title: string;
					total_count: number;
					video: string;
				}[];
			};
		};
		Enums: {
			message_type: 'text' | 'image' | 'video';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views']) | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {
			message_type: ['text', 'image', 'video'],
		},
	},
} as const;
