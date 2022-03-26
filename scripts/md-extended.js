import fs from 'fs'
import path from 'path'

import { parentDir } from './utils.js'

const maxImportStack = 30

const importPrefix = "@import "
const evalBegin = "@>"
const evalEnd = "<@"

function evaluarCodigo(codigo = "") {
    let start = codigo.indexOf(evalBegin)
    while(start != -1) {
        let end = codigo.indexOf(evalEnd)
        if (end == -1) {
            throw "Bloque de javascript no terminado con " + evalEnd
        }

        let jsCode = codigo.substring(start+evalBegin.length, end)
        let result = eval(`(function() { ${jsCode} })()`)

        codigo = codigo.substring(0, start) + result + codigo.substring(end + evalEnd.length)
        start = codigo.indexOf(evalBegin)
    }

    return codigo
}

export function processMarkdown(file = "", importStack = 0) {
    if (importStack >= maxImportStack) {
        throw "Stack de importes excedido al importar `" + file + "`"
    }

    let absPath = path.resolve(file)
    let cwd = parentDir(absPath)

    let contents = fs.readFileSync(file).toString()
    if(contents.indexOf(evalBegin) != -1) {
        contents = evaluarCodigo(contents)
    }

    let lines = contents.split("\n")
    lines.reverse()
    
    let result = []
    for (let line of lines) {
        process.chdir(cwd)
        if(line.startsWith(importPrefix)) {
            let file = line.slice(importPrefix.length)
            if (!path.isAbsolute(file)) {
                file = "./" + file
            }

            if (!file.endsWith(".md")) {
                file += ".md"
            }

            console.log("Importando: `" + file + "`")
            let content = processMarkdown(file, importStack+1)
            let content_lines = content.split("\n")
            content_lines.reverse()
            for (let line of content_lines) {
                result.push(line)
            }
        } else {
            result.push(line)
        }
    }

    result.reverse()

    return result.join("\n")
}