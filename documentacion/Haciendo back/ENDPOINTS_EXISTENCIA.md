

# ENDPOINTS_EXISTENCIA.md

| Endpoint                                 | Existe (✅) | No existe (❌) | Está de más (⚠️) | Estado |
|-------------------------------------------|:-----------:|:-------------:|:----------------:|--------|
| /auth/register (POST)                     |     ✅      |               |                  |        |
| /auth/login (POST)                        |     ✅      |               |                  |        |
| /auth/refresh (POST)                      |     ✅      |              |                  |        |
| /users/profile (GET)                      |     ✅      |              |                  |        |
| /users/profile (PUT)                      |     ✅      |              |                  |        |
| /users/avatar (POST)                      |     ✅      |              |                  |        |
| /properties (GET)                         |     ✅      |               |                  |        |
| /properties/:id (GET)                     |     ✅      |               |                  |        |
| /conversations (GET)                      |     ✅      |               |                  |        |
| /conversations (POST)                     |     ✅      |               |                  |        |
| /conversations/:id (GET)                  |     ✅      |               |                  |        |
| /conversations/:id/participants (POST)    |     ✅      |               |                  |        |
| /conversations/:id/messages (GET)         |     ✅      |               |                  |        |
| /conversations/:id/messages (POST)        |     ✅      |               |                  |        |
| /conversations/:id/messages/file (POST)   |     ✅      |              |                  |        |
| /conversations/:id/messages/read (PUT)    |     ✅      |              |                  |        |
| /conversations/:id/offers (POST)          |     ✅      |              |                  |        |
| /offers/:id/respond (PUT)                 |     ✅      |               |                  |        |
| /conversations/:id/offers (GET)           |     ✅      |              |                  |        |
| /conversations/:id/appointments (POST)    |     ✅      |              |                  |        |
| /appointments/:id (PUT)                   |     ✅      |               |                  |        |

| /api/users (GET)                         |             |               |        ⚠️        |        |
| /api/users/:id (GET)                     |             |               |        ⚠️        |        |
| /api/users (POST)                        |             |               |        ⚠️        |        |
| /api/users/:id (PUT)                     |             |               |        ⚠️        |        |
| /api/users/:id (DELETE)                  |             |               |        ⚠️        |        |
| /api/properties (POST)                   |             |               |        ⚠️        |        |
| /api/properties/:id (PUT)                |             |               |        ⚠️        |        |
| /api/properties/:id (DELETE)             |             |               |        ⚠️        |        |
| /api/offers (GET)                        |             |               |        ⚠️        |        |
| /api/offers/:id (GET)                    |             |               |        ⚠️        |        |
| /api/offers (POST)                       |             |               |        ⚠️        |        |
| /api/offers/:id (PUT)                    |             |               |        ⚠️        |        |
| /api/offers/:id/accept (POST)            |             |               |        ⚠️        |        |
| /api/offers/:id/reject (POST)            |             |               |        ⚠️        |        |
| /api/offers/:id/respond (POST)           |             |               |        ⚠️        |        |
| /api/offers/:id (DELETE)                 |             |               |        ⚠️        |        |
| /api/messages (GET)                      |             |               |        ⚠️        |        |
| /api/messages/:id (GET)                  |             |               |        ⚠️        |        |
| /api/messages (POST)                     |             |               |        ⚠️        |        |
| /api/messages/:id (PUT)                  |             |               |        ⚠️        |        |
| /api/messages/:id (DELETE)               |             |               |        ⚠️        |        |
| /api/notifications (GET)                 |             |               |        ⚠️        |        |
| /api/notifications/:id (GET)             |             |               |        ⚠️        |        |
| /api/notifications (POST)                |             |               |        ⚠️        |        |
| /api/notifications/:id (PUT)             |             |               |        ⚠️        |        |
| /api/notifications/:id (DELETE)          |             |               |        ⚠️        |        |
| /api/appointments (GET)                  |             |               |        ⚠️        |        |
| /api/appointments/:id (GET)              |             |               |        ⚠️        |        |
| /api/appointments (POST)                 |             |               |        ⚠️        |        |
| /api/appointments/schedule (POST)        |             |               |        ⚠️        |        |
| /api/appointments/:id (DELETE)           |             |               |        ⚠️        |        |
| /api/chats (GET)                         |             |               |        ⚠️        |        |
| /api/chats/:id (GET)                     |             |               |        ⚠️        |        |
| /api/chats (POST)                        |             |               |        ⚠️        |        |
| /api/chats/:id (PUT)                     |             |               |        ⚠️        |        |
| /api/chats/:id (DELETE)                  |             |               |        ⚠️        |        |
| /api/pricehistories (GET)                |             |               |        ⚠️        |        |
| /api/pricehistories/:id (GET)            |             |               |        ⚠️        |        |
| /api/pricehistories (POST)               |             |               |        ⚠️        |        |
| /api/pricehistories/:id (PUT)            |             |               |        ⚠️        |        |
| /api/pricehistories/:id (DELETE)         |             |               |        ⚠️        |        |
| /api/verifications (GET)                 |             |               |        ⚠️        |        |
| /api/verifications/:id (GET)             |             |               |        ⚠️        |        |
| /api/verifications (POST)                |             |               |        ⚠️        |        |
| /api/verifications/:id (PUT)             |             |               |        ⚠️        |        |
| /api/verifications/:id (DELETE)          |             |               |        ⚠️        |        |
| /api/roles (GET)                         |             |               |        ⚠️        |        |
| /api/roles/:id (GET)                     |             |               |        ⚠️        |        |
| /api/roles (POST)                        |             |               |        ⚠️        |        |
| /api/roles/:id (PUT)                     |             |               |        ⚠️        |        |
| /api/roles/:id (DELETE)                  |             |               |        ⚠️        |        |
| /api/permissions (GET)                   |             |               |        ⚠️        |        |
| /api/permissions/:id (GET)               |             |               |        ⚠️        |        |
| /api/permissions (POST)                  |             |               |        ⚠️        |        |
| /api/permissions/:id (PUT)               |             |               |        ⚠️        |        |
| /api/permissions/:id (DELETE)            |             |               |        ⚠️        |        |
| /api/files (GET)                         |             |               |        ⚠️        |        |
| /api/files/:id (GET)                     |             |               |        ⚠️        |        |
| /api/files/upload (POST)                 |             |               |        ⚠️        |        |
| /api/files/:id (PUT)                     |             |               |        ⚠️        |        |
| /api/files/:id (DELETE)                  |             |               |        ⚠️        |        |
| /api/files/download/:filename (GET)      |             |               |        ⚠️        |        |
| /api/email/send (POST)                   |             |               |        ⚠️        |        |
| /api/push/send (POST)                    |             |               |        ⚠️        |        |
| /api/storage/upload (POST)               |             |               |        ⚠️        |        |

---

- ✅ = El endpoint existe y funciona según la documentación
- ❌ = El endpoint no existe en el backend
- ⚠️ = El endpoint está de más (no está en la documentación oficial o no debería existir)

Actualiza la columna correspondiente y usa la columna "Estado" para observaciones o el siguiente a revisar.

---

- ✅ = El endpoint existe y funciona según la documentación
- ❌ = El endpoint no existe en el backend
- ⚠️ = El endpoint está de más (no está en la documentación oficial o no debería existir)

Actualiza la columna correspondiente y usa la columna "Estado" para observaciones o el siguiente a revisar.
