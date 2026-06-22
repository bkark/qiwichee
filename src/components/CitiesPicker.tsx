'use client'

import { useState, useRef, useId } from 'react'
import { FR_CITIES } from '@/lib/cities'

interface CitiesPickerProps {
  value: string[]
  onChange: (cities: string[]) => void
}

export default function CitiesPicker({ value, onChange }: CitiesPickerProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const inputId = useId()

  const suggestions =
    query.length < 1
      ? []
      : FR_CITIES.filter(
          (c) => c.toLowerCase().includes(query.toLowerCase()) && !value.includes(c)
        ).slice(0, 8)

  function add(city: string) {
    onChange([...value, city])
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }

  function remove(city: string) {
    onChange(value.filter((c) => c !== city))
  }

  return (
    <div>
      <p className="mb-1 text-sm font-medium text-text">
        Villes <span className="text-muted">(optionnel)</span>
      </p>

      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-2" aria-label="Villes sélectionnées">
          {value.map((city) => (
            <li key={city}>
              <button
                type="button"
                onClick={() => remove(city)}
                className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm text-accent-contrast hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
                aria-label={`Retirer ${city}`}
              >
                {city}
                <span aria-hidden="true">×</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <label htmlFor={inputId} className="sr-only">
          Chercher une ville
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => query && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Chercher une ville…"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={open && suggestions.length > 0 ? listId : undefined}
          aria-expanded={open && suggestions.length > 0}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        />

        {open && suggestions.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            aria-label="Suggestions de villes"
            className="absolute z-10 mt-1 w-full rounded-md border border-border bg-surface shadow-md"
          >
            {suggestions.map((city) => (
              <li key={city} role="option" aria-selected={false}>
                <button
                  type="button"
                  onMouseDown={() => add(city)}
                  className="w-full px-3 py-2 text-left text-sm text-text hover:bg-bg focus:bg-bg focus:outline-none"
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
