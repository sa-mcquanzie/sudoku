require "sinatra"
require "sinatra/cookies"
require "slim"
require "sqlite3"
require "sequel"

require_relative "helpers/grid"
require_relative "helpers/creator"
require_relative "helpers/helpers"

include Helpers

configure do
  enable :sessions
end

DB = Sequel.sqlite "/tmp/test.db"

unless DB.table_exists? :users
  DB.create_table :users do
    primary_key :id
    column :username, String, :null => false
    column :games, String
  end
end

unless DB.table_exists? :games
  DB.create_table :games do
    primary_key :id
    column :solution, String, :null => false
    column :clue, String, :null => false
    column :grade, String, :null => false
  end
end

class User < Sequel::Model; end
class Game < Sequel::Model; end

creator = Creator.new
10.times do
  game = creator.generate_game
  Game.insert(:solution => game[:solution], :clue => game[:clue], :grade => game[:grade].to_s)
  puts "Created #{game}"
end

get "/" do
  @all_games = DB[:games].all
  @sudoku = @all_games.sample
  @id = @sudoku[:id]
  @seed = @sudoku[:solution]
  @seed_clue = @sudoku[:clue]
  @grade = @sudoku[:grade]
  @session = session
  slim :index
end
