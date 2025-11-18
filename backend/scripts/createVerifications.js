const { Verification, User } = require('../src/models');

const verificaciones = [
  { userId: 6, type: 'email', status: 'verified' }, // admin
  { userId: 7, type: 'phone', status: 'pending' }, // buyer
  { userId: 8, type: 'document', status: 'pending' } // buyer
];

async function crearVerificaciones() {
  for (const v of verificaciones) {
    const usuario = await User.findByPk(v.userId);
    if (!usuario) {
      console.log(`Usuario no encontrado: ${v.userId}`);
      continue;
    }
    await Verification.create(v);
    console.log(`Verificación creada para usuario ${v.userId} (${v.type})`);
  }
  console.log('Verificaciones procesadas.');
  process.exit();
}

crearVerificaciones();
