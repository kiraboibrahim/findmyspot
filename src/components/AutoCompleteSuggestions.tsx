import { FormEvent, useCallback, useRef, useState } from 'react';
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import useAutocompleteSuggestions from '../hooks/useAutoCompleteSuggestions';

interface Props {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
}

const AutocompleteSuggestion = ({ onPlaceSelect }: Props) => {
  const ref = useRef(null);

  const places = useMapsLibrary('places');

  const [inputValue, setInputValue] = useState<string>('');
  const { suggestions, resetSession } = useAutocompleteSuggestions(inputValue);

  const handleInput = useCallback((event: FormEvent<HTMLInputElement>) => {
    setInputValue((event.target as HTMLInputElement).value);
  }, []);

  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places) return;
      if (!suggestion.placePrediction) return;

      const place = suggestion.placePrediction.toPlace();

      await place.fetchFields({
        fields: [
          'viewport',
          'location',
          'svgIconMaskURI',
          'iconBackgroundColor'
        ]
      });

      setInputValue('');

      // calling fetchFields invalidates the session-token, so we now have to call
      // resetSession() so a new one gets created for further search
      resetSession();

      onPlaceSelect(place);
    },
    [places, onPlaceSelect]
  );

  return (
    <div className="relative">
      <div className="flex items-center w-full bg-white shadow-lg">
        <div className="pl-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          className="grow-1 p-2 text-gray-500 text-sm bg-white outline-hidden"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          autoCapitalize="none"
          autoFocus
          value={inputValue}
          onInput={event => handleInput(event)}
          placeholder="What is your destination?"
        />
      </div>

      {suggestions.length > 0 && !!inputValue && (
        <ul
          ref={ref}
          className="mt-2 border border-white bg-white shadow-sm absolute z-10 w-full">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.placePrediction?.text.text}
            </li>
          ))}
        </ul>
      )}
    </div >
  );
};
export default AutocompleteSuggestion;
