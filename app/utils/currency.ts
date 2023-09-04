export function formatNumberToPHP(number: number | null) {
  if (!number) return ""

  const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  })

  return formatter.format(number)
}
