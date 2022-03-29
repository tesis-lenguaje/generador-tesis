
# Tesis

Los requerimientos para generarlo:
- [NodeJS](nodejs.org)
- [wkhtmltopdf](https://wkhtmltopdf.org/downloads.html) <-- Necesita estar en el PATH

## Configuración
- wkhtmltopdf debe estar en el PATH antes de ejecutar. [Instrucciones para windows](https://www.neoguias.com/agregar-directorio-path-windows)
- Ejecutar `npm install` en el directorio principal (donde está el archivo `package.json`).
- `node index.js docs/indice.md` compila el pdf de prueba.