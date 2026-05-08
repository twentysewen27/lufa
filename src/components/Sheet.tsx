import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClose:  () => void
}

export default function Sheet({ children, onClose }: Props) {
  return (
    <>
      <div
        className="absolute inset-0 z-80 overlay-enter"
        style={{ background: 'rgba(20,17,12,0.45)' }}
        onClick={onClose}
      />
      <div
        className="absolute left-0 right-0 bottom-0 z-[81] flex flex-col sheet-enter max-h-[88%] overflow-y-auto"
        style={{
          background:   'var(--paper)',
          borderRadius: '28px 28px 0 0',
          padding:      '12px 0 32px',
          boxShadow:    '0 -20px 60px rgba(0,0,0,0.18)',
        }}
      >
        <div
          className="mx-auto mb-2 rounded-full"
          style={{ width: 38, height: 4, background: 'var(--hairline)' }}
        />
        {children}
      </div>
    </>
  )
}
