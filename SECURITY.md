# Política de seguridad

Este repositorio contiene el portfolio personal de David Zabala: una web estática (React + Vite) publicada en GitHub Pages. No gestiona cuentas de usuario, formularios ni datos personales de visitantes.

## Versión soportada

Solo se mantiene la versión publicada desde la rama `main`:
<https://davidzabalaasir-create.github.io/portfolio/>

## Cómo informar de una vulnerabilidad

Si encuentras un problema de seguridad (por ejemplo, una dependencia vulnerable, un enlace malicioso o datos expuestos por error):

1. **No abras un issue público.** Usa el aviso privado de GitHub: pestaña **Security → Report a vulnerability**, o escribe a <davidzamaira2003@gmail.com>.
2. Describe el problema, cómo reproducirlo y su posible impacto.

Intentaré responder en un plazo de **7 días** y te mantendré informado de la corrección.

## Medidas aplicadas

- Dependencias con versiones fijadas en `package-lock.json` e instalación reproducible con `npm ci`.
- Actualizaciones automáticas de dependencias y GitHub Actions mediante Dependabot, revisadas por el CI antes de fusionarse.
- Los documentos publicados (CV y carta) no incluyen teléfono, dirección ni fecha de nacimiento.
