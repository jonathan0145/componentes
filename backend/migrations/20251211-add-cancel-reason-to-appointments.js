// Migración para agregar el campo cancelReason a Appointment
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Appointments', 'cancelReason', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('Appointments', 'cancelReason');
  }
};
