
/*
  # Game Tracker Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `username` (text, unique)
      - `display_name` (text)
      - `bio` (text)
      - `avatar_url` (text)
      - `background_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `game_statuses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `game_id` (text, the game identifier from gamesData)
      - `status` (text: 'playing', 'played', 'wishlist', 'dropped')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `custom_lists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `list_games`
      - `id` (uuid, primary key)
      - `list_id` (uuid, references custom_lists)
      - `game_id` (text)
      - `added_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only read/write their own data
    - Profiles are public (readable by all)
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text,
  bio text,
  avatar_url text,
  background_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Game statuses table
CREATE TABLE IF NOT EXISTS game_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('playing', 'played', 'wishlist', 'dropped')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, game_id)
);

ALTER TABLE game_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own game statuses"
  ON game_statuses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game statuses"
  ON game_statuses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own game statuses"
  ON game_statuses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own game statuses"
  ON game_statuses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Custom lists table
CREATE TABLE IF NOT EXISTS custom_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE custom_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lists"
  ON custom_lists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lists"
  ON custom_lists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lists"
  ON custom_lists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own lists"
  ON custom_lists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- List games junction table
CREATE TABLE IF NOT EXISTS list_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid REFERENCES custom_lists(id) ON DELETE CASCADE NOT NULL,
  game_id text NOT NULL,
  added_at timestamptz DEFAULT now(),
  UNIQUE(list_id, game_id)
);

ALTER TABLE list_games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view games in their lists"
  ON list_games FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM custom_lists
      WHERE custom_lists.id = list_games.list_id
      AND custom_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add games to their lists"
  ON list_games FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM custom_lists
      WHERE custom_lists.id = list_games.list_id
      AND custom_lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove games from their lists"
  ON list_games FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM custom_lists
      WHERE custom_lists.id = list_games.list_id
      AND custom_lists.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_game_statuses_user_id ON game_statuses(user_id);
CREATE INDEX IF NOT EXISTS idx_game_statuses_game_id ON game_statuses(game_id);
CREATE INDEX IF NOT EXISTS idx_custom_lists_user_id ON custom_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_list_games_list_id ON list_games(list_id);
CREATE INDEX IF NOT EXISTS idx_list_games_game_id ON list_games(game_id);