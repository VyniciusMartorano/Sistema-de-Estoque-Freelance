export const COLORS_TAG = {
  GREEN: 'green',
  RED: 'red',
  GRAY: 'gray',
  BLUE: 'blue',
}

export function Tag({ label, color }) {
  return (
    <span
      className={`flex h-6 items-center justify-center rounded-md p-1 font-bold bg-simas-${color}-primary text-white`}
    >
      {label}
    </span>
  )
}
