# Constants and helper methods for creating and displaying sudoku grids

module Helpers

  # Sizes, ranges, etc.

  def grid_size() 3 end
  def area_size() grid_size ** 2 end
  def tile_count() area_size ** 2 end
  def value_range() (1..area_size) end
  def tile_range() (1..tile_count) end
  def areas() [:row, :col, :box] end

  # Attractively print a grid object in the terminal

  def display_grid grid
    horizontal_line = "=" * 31
    vertical_line = "|"
    puts horizontal_line
    ptr = 1
    grid_size.times do
      grid_size.times do
        grid_size.times do
          print vertical_line
          grid_size.times do
            num = grid.tile(ptr)[:content] ||= 0
            content = num.nonzero? ? " #{num} " : " . "
            print content
            ptr += 1
          end
        end
        puts vertical_line
      end
      puts horizontal_line
    end
  end

  # Return the tiles of a grid object as a string

  def as_string grid
    ary = []
    grid.tiles.values.each {|tile| ary << (tile[:content] ||= 0).to_s}
    return ary.join
  end

  # Given an index number, work out which row, column or box it belongs to

  def calculate_area position, area
    case area.to_sym
    when :row
      (position % area_size).zero? ? position / area_size : (position.to_f / area_size).ceil.to_i
    when :col
      (position % area_size).zero? ? area_size : position % area_size
    when :box
      assigned_box = (position / 3.0 % 3).ceil
      return case position
      when 0..27
        assigned_box.zero? ? 3 : assigned_box
      when 28..54
        assigned_box.zero? ? 6 : assigned_box + 3
      when 55..81
        assigned_box.zero? ? 9 : assigned_box + 6
      end
    end
  end
end
