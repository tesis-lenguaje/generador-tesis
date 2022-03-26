import fs from 'fs'
import path from 'path'

export function parentDir(file) {
    let lastSeparator = file.lastIndexOf(path.sep)
    return file.slice(0, lastSeparator)
}