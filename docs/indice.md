# Indice
[[toc]]

@import secciones/tema

@import secciones/objetivos

@import secciones/introduccion

@import secciones/justificacion

@import secciones/bibliografia


# Markdown. What is it good for?

[Ir a introducción](#introducción)
A continuación demostraré cómo se escribe código dentro de markdown:
```javascript
let headers = document.querySelectorAll("h1, h2, h3, h4")
for (let el of headers) {
    let new_el = el.cloneNode(true)
    let parent = document.createElement('li')
    parent.appendChild(new_el)
    el.replaceWith(parent)
}
```