require "sinatra"
require "slim"
require "sequel"
require "pg"

require_relative "helpers/grid"
require_relative "helpers/creator"
require_relative "helpers/helpers"

include Helpers


DB = Sequel.connect(ENV['DATABASE_URL'] || 'postgres://localhost/soodoku')


# Set up the Users table in the database

unless DB.table_exists? :users
  DB.create_table :users do
    primary_key :id
    column :username, String, :null => false
    column :games, String
  end
end

# Instantiate the Games table in the database, generate 50 games, store them in it

unless DB.table_exists? :games
  DB.create_table :games do
    primary_key :id
    column :solution, String, :null => false
    column :clue, String, :null => false
    column :grade, String, :null => false
  end
  creator = Creator.new
  50.times do
  game = creator.generate_game
  Game.insert(:solution => game[:solution], :clue => game[:clue], :grade => game[:grade].to_s)
  puts "Created #{game}"
end
end

class User < Sequel::Model; end
class Game < Sequel::Model; end

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