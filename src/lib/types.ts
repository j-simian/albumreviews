export type User = {
  user_id: string;
  user_name: string;
  bio?: string;
  join_date: string;
  profile_picture?: string;
};

export type Album = {
  album_id: string;
  name: string;
  artist: string;
  release?: string;
  cover_img?: string;
  tracks?: [Track];
};

export type Track = {
  name: string;
  length?: number;
};

export type Review = {
  review_id: string;
  user_id: string;
  album_id: string;
  rating: number;
  subtitle?: string;
  full_text?: string;
  track_ratings?: number[];
  track_texts?: string[];
};
