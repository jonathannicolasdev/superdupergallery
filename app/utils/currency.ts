export function formatNumberToPHP(number: number | null) {
  const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  })

  if (!number) return formatter.format(0)
  return formatter.format(number)
}
