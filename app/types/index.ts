export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type OptionValueLabel = {
  value: string
  label: string
}
