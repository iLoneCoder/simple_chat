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
        queryInterface.addColumn(
          "rooms",
          "is_protected",
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
          }
        ),
        queryInterface.changeColumn(
          "rooms",
          "password",
          {
            type: Sequelize.STRING,
            allowNull: true
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
        queryInterface.removeColumn("rooms", "is_protected"),
        queryInterface.changeColumn(
          "rooms",
          "password",
          {
            type: Sequelize.STRING,
            allowNull: false
          }
        )
      ])
    })
  }
};
