class AddImagesToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :images, :string, array: true, default: []
  end
end
