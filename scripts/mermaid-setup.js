import mmhls from 'headless-mermaid'

export function parseMermaid(content) {
    let config = {
        theme: "forest",
        sequence: {
        //   showSequenceNumbers: true,
        }
    }

    return mmhls.execute(content, config)
}