# Lista de Ilustraciones - Royal Wedding Roulette

Este documento detalla los activos artísticos requeridos para el juego, su estado actual y especificaciones técnicas.

## Especificaciones Generales
*   **Formato:** PNG (con fondo transparente para iconos y marco)
*   **Tamaño Base:** 1024x1024 pixeles (Relación de aspecto 1:1)
*   **Estilo:** Ilustración de libro infantil, acuarela y tinta, caprichoso (whimsical).

## 1. Escenarios (Fondos)
| Archivo | Descripción | Estado |
| :--- | :--- | :--- |
| `bg_church.png` | Interior de iglesia decorada para boda, estilo fantástico/infantil. | **[CREADO]** |

## 2. Elementos de UI
| Archivo | Descripción | Estado |
| :--- | :--- | :--- |
| `frame_wedding.png` | Marco floral decorativo para la foto final de los ganadores. Centro transparente. | **[CREADO]** |

## 3. Iconos de Personajes
Los siguientes iconos se muestran en los botones de elección y en la foto final.

| Archivo | Descripción | Estado |
| :--- | :--- | :--- |
| `icon_groom.png` | El Novio (Tuxedo). | **[CREADO]** |
| `icon_bride.png` | La Novia (Velo y tiara). | **[CREADO]** |
| `icon_bear.png` | Oso de circo suelto. | **[CREADO]** |
| `icon_bishop.png` | El Obispo (Sombrero mitre). | **[CREADO]** |
| `icon_ex.png` | Ex-novia del novio (Expresión celosa). | **[PENDIENTE]** (Usa placeholder: icon_bride.png) |
| `icon_flower.png` | Niña de las flores. | **[PENDIENTE]** (Usa placeholder: icon_bride.png) |
| `icon_guard.png` | Guardia Real (Sombrero alto). | **[PENDIENTE]** (Usa placeholder: icon_groom.png) |
| `icon_grandma.png` | Abuela de 90 años. | **[PENDIENTE]** (Usa placeholder: icon_bride.png) |
| `icon_mother.png` | Madre de la novia (Sombrero elegante). | **[PENDIENTE]** (Usa placeholder: icon_bride.png) |
| `icon_caterer.png` | Chef / Catering hambriento. | **[PENDIENTE]** (Usa placeholder: icon_groom.png) |
| `icon_priest.png` | Sacerdote común. | **[PENDIENTE]** (Usa placeholder: icon_bishop.png) |

## 4. Foto Final (Composición Dinámica)
La "Foto de Boda" final no es una imagen estática única para cada final, sino una **composición generada por código** utilizando los activos anteriores.

*   **Lógica:** Fondo (`frame_wedding.png`) + Icono Ganador 1 + Icono Ganador 2.
*   **Variaciones Posibles:** Dado que cualquier "Cónyuge" (Turno 5) puede casarse con cualquier "Retador" (Turno 2), las combinaciones visuales son automáticas.
    *   *Ejemplo:* Marco + Icono Oso + Icono Abuela = Final "Oso y Abuela".
    *   *Ejemplo:* Marco + Icono Novio + Icono Guardia = Final "Novio y Guardia".
*   **Beneficio:** No es necesario generar cientos de imágenes de parejas específicas; el juego las "monta" visualmente usando los iconos individuales.
