# CONTROLADORES_RATE_LIMITING.md

| Endpoint / Controlador     | Rate limiting implementado | Estado         |
|---------------------------|---------------------------|----------------|
| /users/profile            | ✅                        |                |
| /users/avatar             | ✅                        |                |
| /properties               | ✅                        |                |
| /properties/:id           | ✅                        |                |
| /conversations            | ✅                        |                |
| /conversations/:id        | ✅                        |                |
| /conversations/:id/participants | ✅                  | ← siguiente    |
| /conversations/:id/messages      | ✅                  |                |
| /conversations/:id/messages/file | ✅                  |                |
| /conversations/:id/messages/read | ✅                  | ← siguiente    |
| /conversations/:id/offers        | ✅                  |                |
| /offers/:id/respond              | ✅                  |                |
| /conversations/:id/appointments  | ✅                  |                |
| /appointments/:id                | ✅                  |                |

---

Este checklist sirve para validar e implementar rate limiting por endpoint y usuario. Actualiza la columna "Estado" conforme avances en la implementación y corrección.
