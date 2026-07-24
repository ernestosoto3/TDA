# TDA Spanish Product Glossary

## Purpose

This document defines the approved Spanish terminology for the TDA Version 1 mobile application, administrative interface, API documentation, notifications, and product documentation.

The goal is to ensure that the same feature, action, status, or interface element is always described with the same term. This glossary standardizes product language only; it does not change the approved MVP scope.

---

## Language and Style Rules

- Use clear, neutral Spanish appropriate for users in Puerto Rico.
- Use sentence case for interface text unless the term is a proper name or a named product section.
- Use accent marks and standard Spanish punctuation.
- Prefer short, action-based labels for buttons.
- Do not mix Spanish and English in user-facing interface text.
- Do not use multiple synonyms for the same feature.
- Do not use emojis as interface icons or replacements for labels.
- Keep internal code and API identifiers stable; map them to the approved Spanish labels in the interface and user-facing documentation.
- Apply this glossary to product and system copy. User-generated messages and comments are not rewritten solely to match the glossary.

---

# 1. Main Navigation

TDA will use the following four primary tab labels:

| Product area | Approved Spanish label | Usage |
|---|---|---|
| Home | **Inicio** | Main feed and sports-information overview |
| Community | **Comunidades** | Community directory, joined communities, and community activity |
| Search | **Buscar** | Sports, leagues, teams, athletes, games, posts, articles, and communities |
| User & Settings | **Perfil** | Bottom-tab label for account information, favorites, preferences, and settings |

Additional navigation terminology:

| Element | Approved term |
|---|---|
| Full profile/settings screen title | **Perfil y configuración** |
| Notifications screen | **Notificaciones** |
| Back action | **Volver** |
| Close action | **Cerrar** |
| More options | **Más opciones** |

**Usage rule:** Notifications are accessed through the bell icon in the **Inicio** header and are not a fifth primary tab.

---

# 2. Feed Terminology

| Feature | Approved term | Definition |
|---|---|---|
| Personalized feed | **Favoritos** | Content related to the sports, leagues, teams, and athletes the user has added to Favorites |
| General feed | **Descubre** | General content from all sports and leagues supported by TDA. This is the default discovery view for the current experience. |
| Main content area | **Inicio** | Screen that contains game cards, news, posts, and the feed selector |

### Terms not to use

- Do not use **Siguiendo** as the personalized-feed label.
- Do not use **Descubrir** as a feed label.
- Do not use **Para ti** during Version 1. Use **Descubre** for the general feed and **Favoritos** for content based on the user's selected favorites.

---

# 3. Favorites

| Element or action | Approved term |
|---|---|
| Favorites section | **Favoritos** |
| Add an entity | **Añadir a Favoritos** |
| Remove an entity | **Quitar de Favoritos** |
| Confirmation after adding | **Añadido a Favoritos** |
| Confirmation after removing | **Eliminado de Favoritos** |
| Favorite sports | **Deportes favoritos** |
| Favorite leagues | **Ligas favoritas** |
| Favorite teams | **Equipos favoritos** |
| Favorite athletes | **Atletas favoritos** |

**Usage rule:** Use **Añadir a Favoritos** and **Quitar de Favoritos** instead of **Seguir** and **Dejar de seguir** for sports, leagues, teams, and athletes.

---

# 4. Sports and Game Terminology

## Core Sports Terms

| English concept | Approved Spanish term |
|---|---|
| Sport | **Deporte** |
| League | **Liga** |
| Team | **Equipo** |
| Athlete | **Atleta** |
| Player, when used generically in interface copy | **Atleta** |
| Game | **Juego** |
| Game schedule | **Calendario de juegos** |
| Upcoming games | **Próximos juegos** |
| Previous games | **Juegos anteriores** |
| Game details | **Detalles del juego** |
| Venue | **Sede** |
| Home team | **Equipo local** |
| Away team | **Equipo visitante** |
| Score | **Marcador** |
| Final score | **Marcador final** |
| Final result | **Resultado final** |
| Game recap | **Resumen del juego** |
| Related content | **Contenido relacionado** |

## Approved MVP Game Statuses

| Internal concept | Approved Spanish label | Meaning |
|---|---|---|
| `scheduled` | **Programado** | The game has a confirmed date and time and has not been completed |
| `postponed` | **Pospuesto** | The game will not occur at its previously scheduled date or time |
| `canceled` | **Cancelado** | The game will not be played |
| `finished` / final state | **Final** | The game has ended and the published score is final |

### Version 1 restriction

The following labels must not appear as game statuses in the MVP:

- **En vivo**
- **En curso**

Live scoring is reserved for a future version. A scheduled notification stating that a game is beginning does not imply that TDA provides live scoring.

### Schedule-change rule

**Reprogramado** should not be treated as a separate game status. When a postponed game receives a new verified date and time, update the schedule and return the status to **Programado**. Use **Cambio de horario** for the related notification.

---

# 5. Posts, Articles, and Engagement

| Element or action | Approved term |
|---|---|
| Post | **Publicación** |
| Article | **Artículo** |
| News | **Noticias** |
| Breaking news | **Última hora** |
| Read article | **Leer artículo** |
| View details | **Ver detalles** |
| Like | **Me gusta** |
| Comments | **Comentarios** |
| Add comment | **Comentar** |
| Reply | **Responder** |
| View comments | **Ver comentarios** |
| View replies | **Ver respuestas** |
| Delete own comment | **Eliminar comentario** |
| Share | **Compartir** |
| Related posts | **Publicaciones relacionadas** |
| Related articles | **Artículos relacionados** |
| Saved posts | **Publicaciones guardadas** |
| Highlights | **Jugadas destacadas** |
| Box score | **Estadísticas del juego** |

---

# 6. Search

| Element or state | Approved term |
|---|---|
| Main tab | **Buscar** |
| Search field placeholder | **Buscar deportes, ligas, equipos, atletas, juegos, noticias o comunidades** |
| Search results | **Resultados de búsqueda** |
| Recent searches | **Búsquedas recientes** |
| Clear search field | **Borrar búsqueda** |
| Clear search history | **Borrar historial** |
| Featured leagues | **Ligas destacadas** |
| Popular teams | **Equipos populares** |
| Popular searches | **Búsquedas populares** |
| Sports categories | **Categorías deportivas** |
| No results | **No se encontraron resultados.** |

**Usage rule:** Use **Buscar** for the action and primary tab. Use **Búsqueda** only as a noun within phrases such as **Resultados de búsqueda**.

---

# 7. Communities

## Core Community Terms

| Element or action | Approved term |
|---|---|
| Main tab and directory | **Comunidades** |
| One individual community | **Comunidad** |
| Joined communities section | **Mis comunidades** |
| Browse communities | **Explorar comunidades** |
| Search communities | **Buscar comunidades** |
| Public community | **Comunidad pública** |
| Join | **Unirse a la comunidad** |
| Leave | **Salir de la comunidad** |
| Community member | **Miembro** |
| Community moderator | **Moderador** |
| Community administrator | **Administrador** |
| Community message | **Mensaje** |
| Pinned announcement | **Anuncio fijado** |
| Community rules | **Normas de la comunidad** |
| Community activity | **Actividad de la comunidad** |
| Community notifications | **Notificaciones de la comunidad** |
| Active members | **Miembros activos** |

## Safety Actions

| Action | Approved term |
|---|---|
| Report a message | **Reportar mensaje** |
| Report a user | **Reportar usuario** |
| Block a user | **Bloquear usuario** |
| Unblock a user | **Desbloquear usuario** |
| Mute a user | **Silenciar usuario** |
| Stop muting a user | **Dejar de silenciar** |

### Terms not to use

Do not use the following terms as replacements for the Communities feature:

- **Canales**
- **Grupos**

Use **Comunidades** for the product area and **Comunidad** only when referring to one specific community.

---

# 8. Authentication, Account, and Profile

## Authentication

| Element or action | Approved term |
|---|---|
| Create account | **Crear cuenta** |
| Log in | **Iniciar sesión** |
| Verify account | **Verificar cuenta** |
| Verification code | **Código de verificación** |
| Recover password | **Recuperar contraseña** |
| Change password | **Cambiar contraseña** |
| Log out | **Cerrar sesión** |
| Delete account | **Eliminar cuenta** |
| Email address | **Correo electrónico** |
| Password | **Contraseña** |
| Confirm password | **Confirmar contraseña** |

## Account and Profile

| Element | Approved term |
|---|---|
| Account | **Cuenta** |
| Profile | **Perfil** |
| Profile picture | **Foto de perfil** |
| Display name | **Nombre para mostrar** |
| Username | **Nombre de usuario** |
| Edit profile | **Editar perfil** |
| Edit account information | **Editar información de la cuenta** |
| Account information | **Información de la cuenta** |
| Privacy and security | **Privacidad y seguridad** |
| Language | **Idioma** |
| About TDA | **Acerca de TDA** |
| Contact information | **Información de contacto** |

**Usage rule:** Use **Cuenta** for authentication, credentials, and account-level controls. Use **Perfil** for the user's displayed identity and the primary tab label.

---

# 9. Notifications

## General Notification Terms

| Element or action | Approved term |
|---|---|
| Notification center | **Notificaciones** |
| Notification preferences | **Preferencias de notificaciones** |
| Enable notifications | **Activar notificaciones** |
| Disable notifications | **Desactivar notificaciones** |
| Mark as read | **Marcar como leída** |
| Mark all as read | **Marcar todas como leídas** |
| Previous notifications | **Notificaciones anteriores** |

## Notification Categories

| Notification type | Approved label or message pattern |
|---|---|
| Upcoming game reminder | **Recordatorio de juego** |
| Game beginning | **El juego comienza ahora** |
| Final score | **Resultado final** |
| Schedule change | **Cambio de horario** |
| Breaking news | **Última hora** |
| Comment reply | **Respuesta a tu comentario** |
| Community activity | **Actividad de la comunidad** |
| Official announcement | **Anuncio oficial** |
| System notification | **Notificación del sistema** |

**Usage rule:** **El juego comienza ahora** is a scheduled notification and must not be presented as an **En vivo** game status.

---

# 10. Settings

Use **Configuración** as the standard product term. Do not alternate between **Configuración** and **Ajustes**.

| Section or action | Approved term |
|---|---|
| Settings | **Configuración** |
| Profile and settings | **Perfil y configuración** |
| Notification preferences | **Preferencias de notificaciones** |
| Language settings | **Idioma** |
| Privacy settings | **Privacidad** |
| Security settings | **Seguridad** |
| Save changes | **Guardar cambios** |
| Cancel | **Cancelar** |
| Restore defaults | **Restablecer valores predeterminados** |

---

# 11. Reports and Moderation

Use **Reportar** as the standard user-facing action. Do not alternate between **Reportar** and **Denunciar**.

## User Reporting Actions

| Action or field | Approved term |
|---|---|
| Report | **Reportar** |
| Report a post | **Reportar publicación** |
| Report a comment | **Reportar comentario** |
| Report a message | **Reportar mensaje** |
| Report a user | **Reportar usuario** |
| Report reason | **Motivo del reporte** |
| Submit report | **Enviar reporte** |
| Report confirmation | **Reporte enviado** |

## Suggested Report Reasons

- **Contenido inapropiado**
- **Acoso**
- **Spam**
- **Información falsa**
- **Otro**

## Moderation Terminology

| Element or action | Approved term |
|---|---|
| Moderation | **Moderación** |
| Reports | **Reportes** |
| Pending | **Pendiente** |
| In review | **En revisión** |
| Resolved | **Resuelto** |
| Dismissed | **Desestimado** |
| Review report | **Revisar reporte** |
| Hide content | **Ocultar contenido** |
| Restore content | **Restaurar contenido** |
| Remove content | **Eliminar contenido** |
| Restrict user | **Restringir usuario** |
| Suspend user | **Suspender usuario** |

## Platform Roles

| Role | Approved Spanish term |
|---|---|
| Public visitor | **Visitante** |
| Authenticated user | **Usuario registrado** |
| Moderator | **Moderador** |
| Content administrator | **Administrador de contenido** |
| System administrator | **Administrador del sistema** |

---

# 12. Administrative Interface

| Element or action | Approved term |
|---|---|
| Admin dashboard | **Panel administrativo** |
| Manage | **Administrar** |
| Create | **Crear** |
| Edit | **Editar** |
| Save | **Guardar** |
| Save changes | **Guardar cambios** |
| Delete | **Eliminar** |
| Archive | **Archivar** |
| Restore | **Restaurar** |
| Publish | **Publicar** |
| Unpublish | **Retirar publicación** |
| Draft | **Borrador** |
| Published | **Publicado** |
| Hidden | **Oculto** |
| Upload image | **Subir imagen** |
| Send notification | **Enviar notificación** |
| Verified information | **Información verificada** |
| Information source | **Fuente de información** |

---

# 13. Standard Empty States

Empty-state messages should be direct, helpful, and specific to the screen.

| Context | Approved message |
|---|---|
| General content | **Todavía no hay contenido disponible.** |
| Favorites feed | **Añade deportes, ligas, equipos o atletas a Favoritos para ver contenido aquí.** |
| Discover feed | **Todavía no hay publicaciones disponibles.** |
| Joined communities | **Aún no te has unido a ninguna comunidad.** |
| Community messages | **Aún no hay mensajes en esta comunidad.** |
| Comments | **Aún no hay comentarios.** |
| Notifications | **No tienes notificaciones.** |
| Upcoming games | **No hay juegos programados.** |
| Final scores | **No hay resultados finales disponibles.** |
| Search results | **No se encontraron resultados.** |
| Recent searches | **No tienes búsquedas recientes.** |

---

# 14. Standard Loading States

| Context | Approved message |
|---|---|
| General | **Cargando…** |
| Feed or content | **Cargando contenido…** |
| Search | **Buscando…** |
| Search results | **Cargando resultados…** |
| Game information | **Cargando información del juego…** |
| Communities | **Cargando comunidades…** |
| Notifications | **Cargando notificaciones…** |
| Saving | **Guardando cambios…** |
| Sending a report | **Enviando reporte…** |
| Uploading an image | **Subiendo imagen…** |

---

# 15. Standard Error Messages

Error messages should explain what failed and, when possible, provide a next action.

| Context | Approved message |
|---|---|
| General loading error | **No pudimos cargar el contenido. Inténtalo de nuevo.** |
| General action error | **No pudimos completar la acción. Inténtalo de nuevo.** |
| Connection error | **Sin conexión. Verifica tu conexión a internet.** |
| Unexpected error | **Ocurrió un error inesperado. Inténtalo de nuevo.** |
| Save error | **No se pudieron guardar los cambios. Inténtalo de nuevo.** |
| Login error | **No se pudo iniciar sesión. Verifica tus datos.** |
| Account creation error | **No se pudo crear la cuenta. Inténtalo de nuevo.** |
| Search error | **No pudimos completar la búsqueda. Inténtalo de nuevo.** |
| Favorite action error | **No se pudo actualizar Favoritos. Inténtalo de nuevo.** |
| Comment error | **No se pudo publicar el comentario. Inténtalo de nuevo.** |
| Report error | **No se pudo enviar el reporte. Inténtalo de nuevo.** |
| Community join error | **No se pudo completar la solicitud. Inténtalo de nuevo.** |
| Image upload error | **No se pudo subir la imagen. Inténtalo de nuevo.** |
| Retry action | **Intentar de nuevo** |

---

# 16. Approved Replacement Guide

| Do not use | Use instead |
|---|---|
| Home | **Inicio** |
| Community as the tab label | **Comunidades** |
| Canales | **Comunidades** |
| Grupos | **Comunidades** |
| Search as a user-facing label | **Buscar** |
| User & Settings as a tab label | **Perfil** |
| Settings / Ajustes | **Configuración** |
| Siguiendo | **Favoritos** |
| Descubrir | **Descubre** |
| Para ti | **Descubre** |
| Seguir | **Añadir a Favoritos** |
| Dejar de seguir | **Quitar de Favoritos** |
| En vivo | Not used as an MVP game status |
| En curso | Not used as an MVP game status |
| Denunciar | **Reportar** |
| Partido / encuentro as the general cross-sport term | **Juego** |

---

# 17. Internal Identifier and Display-Label Mapping

Internal code and API values may remain in English. The product must display the approved Spanish labels.

| Internal identifier or concept | Display label |
|---|---|
| `home` | **Inicio** |
| `communities` | **Comunidades** |
| `search` | **Buscar** |
| `profile` / `user_settings` | **Perfil** / **Perfil y configuración** |
| `favorites` | **Favoritos** |
| `discover` | **Descubre** |
| `scheduled` | **Programado** |
| `postponed` | **Pospuesto** |
| `canceled` | **Cancelado** |
| `finished` / final game state | **Final** |
| `notifications` | **Notificaciones** |
| `reports` | **Reportes** |
| `moderation` | **Moderación** |

**Implementation rule:** Do not create multiple internal values solely because several Spanish synonyms previously appeared in wireframes or documentation. One internal concept should map to one approved user-facing term.

---

# 18. Existing Mobile Wireframe Review

Eight mobile wireframes were reviewed against this glossary. The table below records the required product-copy corrections. It does not require rewriting user-generated messages shown inside community conversations.

| Wireframe | Current text | Approved replacement or action | Review result |
|---|---|---|---|
| `01-feed-home` | **Para ti** | **Descubre**. The other selector option should be **Favoritos**. | Change required |
| `01-feed-home` | **Final** | Keep **Final**. | Approved |
| `01-feed-home` | **Resultados** | Acceptable. Use **Resultados finales** only when the section contains exclusively completed games and additional precision is needed. | Acceptable |
| `02-notifications` | **Partido esta noche** | **Juego esta noche** | Change required |
| `02-notifications` | **Partido finalizado** | **Juego finalizado** | Change required |
| `02-notifications` | **Resultado: Criollos 81 - 78 Capitanes** | **Resultado final: Criollos 81 - 78 Capitanes** | Change required |
| `02-notifications` | **Notificaciones** | Keep **Notificaciones**. | Approved |
| `03-game-detail` | **Feed** | **Inicio** | Change required |
| `03-game-detail` | **Highlights** | **Jugadas destacadas** if retained in a future release. Video highlights are not part of the Version 1 scope. | Remove from Version 1 or relabel for future use |
| `03-game-detail` | **Box Score** | **Estadísticas del juego** if retained in a future release. Detailed box scores are not part of the Version 1 scope. | Remove from Version 1 or relabel for future use |
| `03-game-detail` | **Final** | Keep **Final**. | Approved |
| `04-community-list` | **Grupos públicos de deportes en Puerto Rico** | **Comunidades públicas de deportes en Puerto Rico** | Change required |
| `04-community-list` | **234 activos**, **156 activos**, etc. | **234 miembros activos**, **156 miembros activos**, etc. | Change recommended for clarity |
| `04-community-list` | **Comunidades** | Keep **Comunidades**. | Approved |
| `05-community-chat` | **Siguiendo** | Use **Salir de la comunidad** for a joined community and **Unirse a la comunidad** for a community the user has not joined. | Change required |
| `05-community-chat` | **Anuncio** with a pinned indicator | **Anuncio fijado** | Change recommended |
| `05-community-chat` | Emoji message reactions | Remove from the Version 1 wireframe. Community message reactions are not included in Version 1. | Scope correction required |
| `05-community-chat` | **Escribe un mensaje…** | Keep **Escribe un mensaje…**. | Approved |
| `06-search-explore` | **Buscar equipos, jugadores, ligas…** | **Buscar deportes, ligas, equipos, atletas, juegos, noticias o comunidades** | Change required |
| `06-search-explore` | **Explorar** | Keep **Explorar**. | Approved |
| `07-search-recent-popular` | **Buscar equipos, jugadores, ligas…** | **Buscar deportes, ligas, equipos, atletas, juegos, noticias o comunidades** | Change required |
| `07-search-recent-popular` | **Recientes** | **Búsquedas recientes** | Change required |
| `07-search-recent-popular` | **Populares** | **Búsquedas populares** if the feature is retained for a future release. | Relabel or defer with the feature |
| `08-profile-settings` | **Ligas seguidas** | **Ligas favoritas** | Change required |
| `08-profile-settings` | **Posts guardados** | **Publicaciones guardadas** if retained in a future release. Saved posts are not part of the Version 1 scope. | Remove from Version 1 or relabel for future use |
| `08-profile-settings` | **Información de cuenta** | **Información de la cuenta** | Change required |
| `08-profile-settings` | **Preferencias de contenido** | **Administrar Favoritos**, or remove this separate option. Version 1 content is determined by the user's favorite sports, leagues, teams, and athletes rather than a separate content-preferences system. | Change required |
| `08-profile-settings` | **Equipos favoritos**, **Mis comunidades**, **Configuración**, **Notificaciones**, **Privacidad**, **Seguridad**, and **Idioma** | Keep these terms. | Approved |

## Wireframe Review Summary

The main inconsistencies found were:

- English labels remaining in the Spanish interface: **Feed**, **Highlights**, and **Box Score**.
- Terms already rejected by the approved product decisions: **Para ti**, **Siguiendo**, and **Grupos**.
- Inconsistent terminology for sports entities and actions: **jugadores**, **partido**, and **Ligas seguidas**.
- Ambiguous shortened headings: **Recientes**, **Populares**, and counts such as **234 activos**.
- **Preferencias de contenido** suggests a separate personalization system; Version 1 content should instead be controlled through the user's **Favoritos**.
- Elements shown in the wireframes but excluded from Version 1: video highlights, detailed box scores, community message reactions, saved posts, and popular searches.

---

# 19. Confirmed Product Decisions

The following terminology decisions are approved for Version 1:

1. Use **Favoritos** instead of **Siguiendo**.
2. Use **Descubre** instead of **Descubrir** or **Para ti**.
3. Use **Comunidades** instead of **Canales** or **Grupos**.
4. Use **Añadir a Favoritos** instead of **Seguir**.
5. Use **Programado**, **Pospuesto**, **Cancelado**, and **Final** as the MVP game statuses.
6. Do not include **En vivo** as an MVP game status.
7. Use **Configuración** instead of **Ajustes**.
8. Use **Reportar** instead of **Denunciar**.
9. Use **Descubre** as the general feed and **Favoritos** for content based on the user's selected favorites. Do not create a separate MVP content-preferences system.

---

# Approval Criteria

This glossary is ready for team approval when:

- The approved terms are accepted for the mobile application and administrative interface.
- The terminology is applied consistently to product documentation and notification templates.
- The currently supplied wireframes have been reviewed using the checklist in this document.
- New interface copy uses the approved empty, loading, and error messages.
- Future localization work uses these Spanish terms as the Version 1 source language.
