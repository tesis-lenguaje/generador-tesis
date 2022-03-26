import { program } from 'commander'
import fs from 'fs'
import path from 'path'

import MarkdownIt from 'markdown-it'
import pdf from 'pdf-creator-node'
import toc from 'markdown-it-table-of-contents'
import anchor from 'markdown-it-anchor'
import { JSDOM } from 'jsdom'

import { exec } from 'child_process'

import { processMarkdown } from './scripts/md-extended.js'

import { parentDir } from './scripts/utils.js'
import { enumerarHs } from './scripts/html-processing.js'

String.prototype.llenarVariable = function(nombre, valor) {
    return this.replace(`#{${nombre}}#`, valor)
}

let md = new MarkdownIt({
    html: true,
    linkify: true
})

md.use(anchor, {
    permalinkBefore: true, permalinkSymbol: '§',
    // permalink: anchor.permalink.headerLink()
})
md.use(toc, {
    listType: "ol"
})

program
    .description("Toma un documento `.md` y genera un `.pdf`")
    .argument("<archivo>", "archivo markdown a leer")
    .option("-t, --template <plantilla>", "plantilla para el html", "docs/template.html")
    .option("-o, --output <salida>", "archivo pdf a generar", "output.pdf")

program.parse(process.argv)
let flags = program.opts()

let filename = path.resolve(program.args[0])

let output = path.resolve(flags.output)

// console.log(flags.template)
let templateName = path.resolve(flags.template)

// let template = fs.readFileSync(program.opts().template)
let template = fs.readFileSync(templateName).toString()

let newPath = parentDir(templateName)

process.chdir(newPath)

let processed = processMarkdown(filename)

let rendered = md.render(processed)

var options = {
    format: "Letter",
    orientation: "portrait",
    border: "10mm",
    // header: {
    //     height: "5mm",
    //     contents: '<div style="text-align: center;">Lenguaje de programación en español</div>'
    // },
    footer: {
        height: "5mm",
        contents: {
            default: '<span style="color: #444;">{{page}}</span><!--/<span>{{pages}}</span>-->',
            last: 'Fin'
        }
    }
}

let conTemplate = template.llenarVariable("contenido", rendered)

const window = new JSDOM(conTemplate)
const { document } = window.window

// let styles = document.querySelectorAll('link[rel="stylesheet"]')
// for (let tag of styles) {
//     let styleFilename = tag.href
//     let content = fs.readFileSync(styleFilename)

//     tag.href = ""
//     tag.innerText = "\n" + content + "\n"
// }

enumerarHs(document)

let actualHTML = document.documentElement.innerHTML
let HTMLOutput = path.basename(output, ".pdf") + ".html"
fs.writeFileSync(HTMLOutput, actualHTML)

exec(`wkhtmltopdf -s Letter --enable-local-file-access --print-media-type ${HTMLOutput} ${output}`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    
    console.log("PDF Generado en " + output)
})