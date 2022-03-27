import { program } from 'commander'
import fs from 'fs'
import path from 'path'

import MarkdownIt from 'markdown-it'
import toc from 'markdown-it-table-of-contents'
import anchor from 'markdown-it-anchor'
import { JSDOM } from 'jsdom'

import { exec } from 'child_process'

import { processMarkdown } from './scripts/md-extended.js'

import { parentDir } from './scripts/utils.js'
import { enumerarHs } from './scripts/html-processing.js'

import hljs from 'highlight.js'
import { parseMermaid } from './scripts/mermaid-setup.js'

String.prototype.llenarVariable = function(nombre, valor) {
    return this.replace(`#{${nombre}}#`, valor)
}

function isNumber(char) {
    if (typeof char !== 'string') {
      return false;
    }
  
    if (char.trim() === '') {
      return false;
    }
  
    return !isNaN(char);
  }

let mermaidPromises = []
let mermaidIdPrefix = "diag-"

let md = new MarkdownIt({
    html: true,
    linkify: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
              return '<pre class="hljs"><code>' +
                     hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                     '</code></pre>';
            } catch (__) {}
        } else if (lang == 'mermaid') {
            // Handle mermaid
            let size = null
            if(isNumber(str.charAt(0))) {
                let space = str.indexOf(' ')
                size = str.substring(0, space)
                str = str.substring(space+1)
            }

            let num = Math.floor(Math.random()*10000)
            let promise = parseMermaid(str)
                                .then(svg => {
                                    return { content: svg, num: num, size: size }
                                })
            mermaidPromises.push(promise)
            return `<pre class="mermaid-diagram" id="${mermaidIdPrefix}${num}"></pre>`
        }
    
        return ''; // use external default escaping
      }
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

let conTemplate = template.llenarVariable("contenido", rendered)

const window = new JSDOM(conTemplate)
const { document } = window.window

if (mermaidPromises.length > 0) 
    console.log("Generando diagramas")

let contents = await Promise.all(mermaidPromises)
for(let item of contents) {
    let svg = item.content
    let id = "#" + mermaidIdPrefix + item.num

    let pre = document.querySelector(id)
    let size = item.size ?? "3in"
    svg = "<svg " + 'height="' + size + '" ' + svg.substring("<svg".length)

    pre.innerHTML = svg
}

if (contents.length > 0) 
    console.log("Diagramas generados")

enumerarHs(document)

let actualHTML = document.documentElement.innerHTML
let HTMLOutput = path.basename(output, ".pdf") + ".html"
fs.writeFileSync(HTMLOutput, actualHTML)

exec(`wkhtmltopdf --page-width 8.5in --page-height 11in --enable-local-file-access --print-media-type ${HTMLOutput} ${output}`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    
    console.log("PDF Generado en " + output)
})