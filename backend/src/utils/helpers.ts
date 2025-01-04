export function getSetValueByIndex(set: Set<string>, index: number): string | null {
    if (index < 0 || set.size === 0 || index >= set.size) {
        return null
    }

    let i = 0
    let item: string = ""
    for (const elem of set) {
        if (i === index) item = elem
        i++
    }

    return item
}