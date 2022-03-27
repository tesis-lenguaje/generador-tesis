# Indice
[[toc]]
[Enlace a código](#codigo)

```mermaid
5cm graph TD;
    A[Investigar normas apa]-->B;
    A-->C;
    B-->D;
    C-->D;
```

@import secciones/tema

# Qué tal van los h4?
#### Bueno...
No creo que haya mucho problema. Lo principal es que detecte que esto es un parrafo que va a la par.

@import secciones/objetivos

@import secciones/introduccion

@import secciones/justificacion

# ¿Qué tal van las gráficas?

```mermaid
10cm sequenceDiagram
Alice ->> Bob: Hello Bob, how are you?
Bob-->>John: How about you John?
Bob--x Alice: I am good thanks!
Bob-x John: I am good thanks!

Bob-->Alice: Checking with John...
Alice->John: Yes... John, how are you?
```

Quisiera poder renderizar una grafica de `UML` en este lugar, por favor:

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
<@