interface SuggestionsProps {
  suggestions: string[];
  selectSuggestion: (suggestion: string) => void;
}

export function Suggestions({
  suggestions,
  selectSuggestion,
}: SuggestionsProps) {
  return (
    <div className="flex flex-row flex-wrap gap-x-2 gap-y-2">
      {suggestions &&
        suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="px-3 py-1 border rounded-full border-neutral-900 hover:border-neutral-800 text-neutral-600 hover:text-neutral-500 fade-in-2s"
            onClick={() => selectSuggestion(suggestion)}
          >
            <span className="text-sm font-light">{suggestion}</span>
          </button>
        ))}
    </div>
  );
}
