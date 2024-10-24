export function SpanError({ error }) {
  return (
    <span className="mt-1 pl-2 text-[10px] italic text-sgc-red-primary">
      {error ?? 'Erro na validação!'}
    </span>
  )
}
