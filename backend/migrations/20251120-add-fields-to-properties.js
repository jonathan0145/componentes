'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Properties', 'city', { type: Sequelize.STRING });
    await queryInterface.addColumn('Properties', 'state', { type: Sequelize.STRING });
    await queryInterface.addColumn('Properties', 'postalCode', { type: Sequelize.STRING });
    await queryInterface.addColumn('Properties', 'status', { type: Sequelize.STRING, defaultValue: 'active' });
    await queryInterface.addColumn('Properties', 'propertyType', { type: Sequelize.STRING });
    // Features planos
    await queryInterface.addColumn('Properties', 'furnished', { type: Sequelize.BOOLEAN, defaultValue: false });
    await queryInterface.addColumn('Properties', 'petFriendly', { type: Sequelize.BOOLEAN, defaultValue: false });
    await queryInterface.addColumn('Properties', 'elevator', { type: Sequelize.BOOLEAN, defaultValue: false });
    await queryInterface.addColumn('Properties', 'balcony', { type: Sequelize.BOOLEAN, defaultValue: false });
    await queryInterface.addColumn('Properties', 'garden', { type: Sequelize.BOOLEAN, defaultValue: false });
    await queryInterface.addColumn('Properties', 'pool', { type: Sequelize.BOOLEAN, defaultValue: false });
    await queryInterface.addColumn('Properties', 'gym', { type: Sequelize.BOOLEAN, defaultValue: false });
    await queryInterface.addColumn('Properties', 'security', { type: Sequelize.BOOLEAN, defaultValue: false });
    await queryInterface.addColumn('Properties', 'airConditioning', { type: Sequelize.BOOLEAN, defaultValue: false });
    await queryInterface.addColumn('Properties', 'heating', { type: Sequelize.BOOLEAN, defaultValue: false });
    await queryInterface.addColumn('Properties', 'internet', { type: Sequelize.BOOLEAN, defaultValue: false });
    await queryInterface.addColumn('Properties', 'laundry', { type: Sequelize.BOOLEAN, defaultValue: false });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Properties', 'city');
    await queryInterface.removeColumn('Properties', 'state');
    await queryInterface.removeColumn('Properties', 'postalCode');
    await queryInterface.removeColumn('Properties', 'status');
    await queryInterface.removeColumn('Properties', 'propertyType');
    await queryInterface.removeColumn('Properties', 'furnished');
    await queryInterface.removeColumn('Properties', 'petFriendly');
    await queryInterface.removeColumn('Properties', 'elevator');
    await queryInterface.removeColumn('Properties', 'balcony');
    await queryInterface.removeColumn('Properties', 'garden');
    await queryInterface.removeColumn('Properties', 'pool');
    await queryInterface.removeColumn('Properties', 'gym');
    await queryInterface.removeColumn('Properties', 'security');
    await queryInterface.removeColumn('Properties', 'airConditioning');
    await queryInterface.removeColumn('Properties', 'heating');
    await queryInterface.removeColumn('Properties', 'internet');
    await queryInterface.removeColumn('Properties', 'laundry');
  }
};
