'use strict';

import { DataTypes, QueryInterface, Transaction } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.sequelize.transaction((t: Transaction) => {
      return Promise.all([
        queryInterface.addIndex(
          "users",
          ["username"],
          {
            name: "users_username_index",
          }
        ),

        queryInterface.addIndex(
          "rooms",
          ["name"],
          {
            name: "rooms_name_index"
          }
        )
      ])
    })
  },

  async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.transaction((t: Transaction) => {
      return Promise.all([
        queryInterface.removeIndex("users", "users_username_index"),
        queryInterface.removeIndex("users", "rooms_name_index")
      ])
    })
  }
};
