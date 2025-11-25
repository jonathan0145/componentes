'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Offers', 'conversationId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
    await queryInterface.addColumn('Offers', 'paymentTerms', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Offers', 'closingDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Offers', 'conditions', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Offers', 'validUntil', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Offers', 'conversationId');
    await queryInterface.removeColumn('Offers', 'paymentTerms');
    await queryInterface.removeColumn('Offers', 'closingDate');
    await queryInterface.removeColumn('Offers', 'conditions');
    await queryInterface.removeColumn('Offers', 'validUntil');
  }
};
