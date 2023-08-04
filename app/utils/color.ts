export function getColorFromString(inputString: string) {
  const colors = [
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "emerald",
    "teal",
    "cyan",
    "sky",
    "blue",
    "indigo",
    "violet",
    "purple",
    "fuchsia",
    "pink",
    "rose",
  ]

  const hashCode = inputString
    .split("")
    .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)

  const colorIndex = Math.abs(hashCode) % colors.length

  return colors[colorIndex]
}
