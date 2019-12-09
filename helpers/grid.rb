require_relative "helpers"

class Grid
  include Helpers
  def initialize string
    @string = string
    reset_all
  end

  def tiles() @tiles end
  def tile(num) @tiles[num] end
  def row(num) @row[num] end
  def col(num) @col[num] end
  def box(num) @box[num] end

  def reset_all
    @tiles = {}
    @row = value_range.each_with_object({}) {|key, hsh| hsh[key] = []}
    @col = value_range.each_with_object({}) {|key, hsh| hsh[key] = []}
    @box = value_range.each_with_object({}) {|key, hsh| hsh[key] = []}
    @string.each_char.with_index do |num, ind|
      content = num.to_i.nonzero? ? num.to_i : nil
      fixed = num.to_i.nonzero? ? true : false
      @tiles[ind + 1] = {
        row: calculate_area(ind + 1, :row),
        col: calculate_area(ind + 1, :col),
        box: calculate_area(ind + 1, :box),
        fixed: fixed,
        content: content,
        neighbours: [],
        candidates: value_range.each_with_object({}) {|key, hsh| hsh[key] = num.to_i > 0 ? false : true}
        }
      @row[@tiles[ind + 1][:row]] << ind + 1
      @col[@tiles[ind + 1][:col]] << ind + 1
      @box[@tiles[ind + 1][:box]] << ind + 1
    end
    @tiles.each do |position, tile|
      @tiles.each do |other_position, other_tile|
        areas.each do |area|
          if tile[area].eql? other_tile[area] and not other_position.eql? position
            tile[:neighbours] << other_position
            tile[:neighbours].uniq!
          end
        end
      end
    end
    update_candidates
  end

  def random_incomplete_area
    [@row, @col, @box].sample[(1..9).to_a.sample]
  end

  def random_tile_selection
    hsh = {}
    random_incomplete_area.each {|position| hsh[position] = @tiles[position]}
    hsh = hsh.select {|_, tile| tile[:candidates].values.include? true and (not tile[:fixed])}
    unless hsh.empty?
      return hsh
    else
      random_tile_selection
    end
  end

  def complete_count
    @tiles.values.count {|tile| not tile[:content].eql? nil and tile[:content].nonzero?}
  end

  def complete?
    complete_count.eql? tile_count
  end

  def update_candidates
    @tiles.select {|_, tile| not tile[:fixed]}.each do |position, tile|
      @tiles.each do |other_position, other_tile|
        areas.each do |area|
          if tile[area].eql? other_tile[area] and not other_position.eql? position
            tile[:candidates][other_tile[:content]] = false if other_tile[:content]
          end
        end
      end
    end
  end

  def fill_singles
    @tiles.select {|_, tile| not tile[:fixed]}.each_value do |tile|
      if tile[:candidates].values.count(true).eql? 1
        solution = tile[:candidates].invert[true]
        tile[:content] = solution
        tile[:candidates][solution] = false
        tile[:fixed] = true
        update_candidates    
      end
    end
  end

  def fill_area_singles
    areas.each do |area|
      @tiles.select {|_, tile| not tile[:fixed]}.each do |position, tile|
        hsh = value_range.each_with_object({}) {|key, hsh| hsh[key] = 0}               
        @tiles.each do |other_position, other_tile|
          if tile[area].eql? other_tile[area] and not other_position.eql? position
            other_tile[:candidates].each {|key, val| hsh[key] += 1 if val}
          end
        end    
        unless hsh.invert[1].nil?
          recipient = @tiles.select {|_, tile2| tile2[area].eql? tile[area] and tile2[:candidates][hsh.invert[1]]}.keys
          if recipient.size.eql? 1
            @tiles[recipient[0]][:content] = hsh.invert[1]
            @tiles[recipient[0]][:candidates] = value_range.each_with_object({}) {|key, hsh| hsh[key] = false}
            @tiles[recipient[0]][:fixed] = true
            update_candidates
            next
          end
        end
      end   
    end
  end

  def basic_solver
    until complete?
      before = complete_count  
      fill_singles
      fill_area_singles
      fill_singles
      after = complete_count
      break if before == after
    end
  end

  def bruteforcer
    until complete?
      selected = random_tile_selection
      ary = []
      selected.values.each {|tile| ary << tile[:candidates].select {|key, val| val}.keys}
      combinations = ary.inject(&:product).map(&:flatten).reject! {|combo| not combo.eql? combo.uniq}
      combinations.each do |combo|
        combo.each_with_index do |num, ind|
          selected.values[ind][:content] = num
        end
        update_candidates
        basic_solver
        unless complete?
          reset_all
          basic_solver
        else
          return
        end
      end
      next unless complete?
    end
  end

  def solve
    until complete?
      basic_solver
      bruteforcer
    end
    return as_string self
  end
end