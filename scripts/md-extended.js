import fs from 'fs'
import path from 'path'

import { parentDir } from './utils.js'

const maxImportStack = 30

const importPrefix = "@import "
const evalBegin = "@>"
const evalEnd = "<@"

const tagIdMarker = "@#"
const tagClassMarker = "@."
const errorClassMarker = "@!"
const questionClassMarker = "@?"

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

function resolveTags(codigo = "") {
    let start = codigo.indexOf(tagIdMarker)
    while(start != -1) {
        let end = codigo.substring(start).indexOf(" ")
        if (end == -1) { end = codigo.length }
        else { end += start }

        let tagID = codigo.substring(start+tagIdMarker.length, end)
        let tag = `<span id="${tagID}"></span>`

        codigo = codigo.substring(0, start) + tag + codigo.substring(end)
        start = codigo.indexOf(tagIdMarker)
    }

    start = codigo.indexOf(tagClassMarker)
    while(start != -1) {
        let end = codigo.substring(start).indexOf(" ")
        if (end == -1) { end = codigo.length }
        else { end += start }

        let tagID = codigo.substring(start+tagClassMarker.length, end)
        let tag = `<span class="${tagID}"></span>`

        codigo = codigo.substring(0, start) + tag + codigo.substring(end)
        start = codigo.indexOf(tagClassMarker)
    }

    let result = []
    for (let line of codigo.split("\n")) {
        if(line.trim().startsWith(questionClassMarker)) {
            let index = line.indexOf(questionClassMarker)
            let rest = line.substring(index + questionClassMarker.length)
            let isEmpty = !rest.trim() 
            result.push(`<p class="correccion correccion-enlinea"><span class="correccion-pregunta  ${isEmpty ? "correccion-vacia" : ""}">${rest}</span></p>\n`)
        } else if (line.indexOf(questionClassMarker + "(") != -1) {
            let index = line.indexOf(questionClassMarker + "(") + questionClassMarker.length + 1
            let lineStart = line.substring(0, index - questionClassMarker.length - 1)
            let secondIndex = line.indexOf(")")
            let rest = line.substring(index, secondIndex)
            let lineEnd = line.substring(secondIndex+1)
            let isEmpty = !rest.trim()
            result.push(`${lineStart} <span class="correccion"><span class="correccion-pregunta ${isEmpty ? "correccion-vacia" : ""}">${rest}</span></span> ${lineEnd}\n`)
        } else if(line.trim().startsWith(errorClassMarker)) {
            let index = line.indexOf(errorClassMarker)
            let rest = line.substring(index + errorClassMarker.length)
            let isEmpty = !rest.trim() 
            result.push(`<p class="correccion correccion-enlinea"><span class="correccion-error ${isEmpty ? "correccion-vacia" : ""}">${rest}</span></p>\n`)
        } else if (line.indexOf(errorClassMarker + "(") != -1) {
            let index = line.indexOf(errorClassMarker + "(") + errorClassMarker.length + 1
            let lineStart = line.substring(0, index - questionClassMarker.length - 1)
            let secondIndex = line.indexOf(")")
            let rest = line.substring(index, secondIndex)
            let lineEnd = line.substring(secondIndex+1)
            let isEmpty = !rest.trim()
            result.push(`${lineStart} <span class="correccion"><span class="correccion-error ${isEmpty ? "correccion-vacia" : ""}">${rest}</span></span> ${lineEnd}\n`)
        } else {
            result.push(line)
        }
    }



    return result.join("\n")
}

export function processMarkdown(file = "", importStack = 0) {
    if (importStack >= maxImportStack) {
        throw "Stack de importes excedido al importar `" + file + "`"
    }

    let absPath = path.resolve(file)
    let cwd = parentDir(absPath)

    let contents = fs.readFileSync(file).toString()
    contents = evaluarCodigo(contents)

    let lines = contents.split("\n")
    lines.reverse()
    
    let result = []
    for (let line of lines) {
        line = resolveTags(line)
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