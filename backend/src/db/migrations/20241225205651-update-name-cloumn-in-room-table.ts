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
    await queryInterface.changeColumn(
      "rooms",
      "name",
      {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    )
  },

  async down (queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn(
      "rooms",
      "name",
      {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
      }
    )
  }
};
