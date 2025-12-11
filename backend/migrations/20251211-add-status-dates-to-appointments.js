// Migración para agregar campos de fechas de estado a Appointment
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Appointments', 'confirmedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Appointments', 'completedAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Appointments', 'cancelledAt', {
      type: Sequelize.DATE,
      allowNull: true
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Appointments', 'confirmedAt');
    await queryInterface.removeColumn('Appointments', 'completedAt');
    await queryInterface.removeColumn('Appointments', 'cancelledAt');
  }
};
