export function enumerarHs(document) {
    let h1s = 0
    let h2s = 0
    let h3s = 0

    let headers = document.querySelectorAll("h1, h2, h3")
    for (let el of headers) {
        switch (el.tagName) {
            case "H1":
                h1s += 1
                h2s = 0
                h3s = 0
                el.setAttribute("contador", `${h1s}. `)
                break
            case "H2":
                h2s += 1
                h3s = 0
                el.setAttribute("contador", `${h1s}.${h2s}. `)
                break
            case "H3":
                h3s += 0
                el.setAttribute("contador", `${h1s}.${h2s}.${h3s}. `)
                break
            default:
                break
        }
    }
}