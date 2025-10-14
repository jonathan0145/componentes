const { Role, Permission } = require('../src/models');

const permisosPorRol = {
  buyer: [
    'crear_conversacion',
    'ver_historial_conversacion',
    'archivar_conversacion',
    'enviar_texto',
    'enviar_archivo',
    'enviar_oferta_formal',
    'programar_cita',
    'ver_datos_personales',
    'ver_informacion_contacto',
    'ver_historial_conversaciones',
    'ver_estadisticas_actividad',
    'reportar_problemas'
  ],
  seller: [
    'crear_conversacion',
    'ver_historial_conversacion',
    'archivar_conversacion',
    'enviar_texto',
    'enviar_archivo',
    'enviar_documento_legal',
    'enviar_oferta_formal',
    'programar_cita',
    'ver_datos_personales',
    'ver_informacion_contacto',
    'ver_historial_conversaciones',
    'ver_estadisticas_actividad',
    'ver_reportes_transacciones',
    'reportar_problemas',
    'acceso_analytics'
  ],
  agent: [
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
  ],
  admin: [
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
  ]
};

async function crearPermisosPorRol() {
  for (const rol in permisosPorRol) {
    const roleInstance = await Role.findOne({ where: { name: rol } });
    if (!roleInstance) {
      console.log(`Rol no encontrado: ${rol}`);
      continue;
    }
    for (const permiso of permisosPorRol[rol]) {
      await Permission.findOrCreate({
        where: { roleId: roleInstance.id, action: permiso },
        defaults: { allowed: true }
      });
      console.log(`Permiso '${permiso}' asociado a rol '${rol}'`);
    }
  }
  console.log('Permisos por rol procesados.');
  process.exit();
}

crearPermisosPorRol();
