# Indice
[[toc]]
[Enlace a código](#codigo)

@import secciones/tema

@import secciones/objetivos

@import secciones/introduccion

@import secciones/justificacion

# Probando preprocesado de javascript al compilar a pdf:

El código:@#codigo
```javascript
let result = "<ol>"

let a = 0
let b = 1
let c = 0
for (let i = 0; i < 20; i++) {
    a = b
    b = c
    result += "<li>" + c + "</li>"
    c = a + b
}

result += "</ul>"
return result
```

genera el siguiente resultado en compilación: @>
    let result = "<ol>"

    let a = 0
    let b = 1
    let c = 0
    for (let i = 0; i < 20; i++) {
        a = b
        b = c
        result += "<li>" + c + "</li>"
        c = a + b
    }

    result += "</ol>"
    return result
<@.