const { Permission } = require('../src/models');

const permisos = [
  'crear_conversacion',
  'unirse_conversacion',
  'ver_historial_conversacion',
  'archivar_conversacion',
  'eliminar_conversacion',
  'invitar_terceros',
  'enviar_texto',
  'enviar_archivo',
  'enviar_documento_legal',
  'enviar_oferta_formal',
  'enviar_mensaje_sistema',
  'programar_cita',
  'ver_datos_personales',
  'ver_informacion_contacto',
  'ver_historial_conversaciones',
  'ver_estadisticas_actividad',
  'ver_reportes_transacciones',
  'moderar_conversaciones',
  'reportar_problemas',
  'bloquear_usuarios',
  'acceso_analytics',
  'configurar_automatizaciones'
];

async function crearPermisos() {
  for (const nombre of permisos) {
    await Permission.findOrCreate({ where: { action: nombre } });
    console.log(`Permiso creado o existente: ${nombre}`);
  }
  console.log('Todos los permisos han sido procesados.');
  process.exit();
}

crearPermisos();
