const { Role } = require('../src/models');
(async () => {
  await Role.create({ name: 'admin', description: 'Administrador del sistema' });
  console.log('Rol admin creado');
})();
