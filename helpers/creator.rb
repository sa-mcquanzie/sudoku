require_relative "grid"
require_relative "helpers"

class Creator
  include Helpers
  def initialize
  end

  def generate_solution
    ary = ("0" * tile_count).chars.map(&:to_i)
    until ary.count(0).zero?
      ary.each_with_index do |num, ind|
        row = calculate_area(ind + 1, :row)
        col = calculate_area(ind + 1, :col)
        box = calculate_area(ind + 1, :box)
        row_neighbours = tile_range.to_a.select {|n| calculate_area(n, :row).eql? row}
        col_neighbours = tile_range.to_a.select {|n| calculate_area(n, :col).eql? col}
        box_neighbours = tile_range.to_a.select {|n| calculate_area(n, :box).eql? box}
        neighbours = (row_neighbours + col_neighbours + box_neighbours).uniq!.map {|n| n -= 1}
        neighbouring_values = []
        neighbours.each {|n| neighbouring_values << ary[n]}
        options = (0..area_size).to_a.reject! {|x| neighbouring_values.compact.include?(x)}
        if options == []
          ary = ("0" * tile_count).chars.map(&:to_i)
          break
        end
        ary[ind] = options.sample
      end
    end
    return ary.join
  end

  def generate_game
    solution = generate_solution    
    game = {solution: solution, clue: solution, grade: :easy, number_of_clues: 0, perfect: false}
    grid = (Grid.new(solution))
    timer = 0
    start_time = Time.now
    until grid.complete_count.eql? 17 or timer > 20
      timer = Time.now - start_time
      tile = grid.tile(rand(1..81))
      original_content = tile[:content]
      tile[:content] = 0
      new_grid = Grid.new(as_string grid)
      new_clue = as_string new_grid
      new_grid.solve
      working_clue = new_clue if solution.eql? as_string(new_grid)
      if solution != as_string(new_grid)
        tile[:content] = original_content       
        game[:clue] = working_clue
        game[:number_of_clues] = tile_count - working_clue.chars.count("0")
        if timer < 5
          if game[:number_of_clues] < 40
            game[:grade] = :easy
          else
            game[:grade] = :baby
          end
        elsif timer < 10
          game[:grade] = :hard
        else
          game[:grade] = :medium
        end
        if game[:number_of_clues] == 17
          game[:perfect] = true
        end
        return game
      end
    end
  end

  def generate_game_with_grade grade
    game = {}
    until game[:grade].eql? grade.to_sym
      game = generate_game
    end
    return game
  end

  def generate_perfect_game
    game = {}
    until game[:perfect].eql? true
      game = generate_game
    end
    return game
  end
end
