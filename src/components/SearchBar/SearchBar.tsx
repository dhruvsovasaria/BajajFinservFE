import { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

interface SearchBarProps {
  doctors: Array<{
    id: number;
    name: string;
    specialties: string[];
  }>;
  onSearch: (term: string) => void;
}

const SearchBar = ({ doctors, onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ name: string; specialty: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const matches = doctors
        .filter((doctor) => doctor.name.toLowerCase().includes(value.toLowerCase()))
        .map((doctor) => ({
          name: doctor.name,
          specialty: doctor.specialties[0] || "Doctor",
        }))
        .slice(0, 3);

      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: { name: string }) => {
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);
    onSearch(suggestion.name);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      onSearch(searchTerm);
    }
  };

  const handleSearchIconClick = () => {
    setShowSuggestions(false);
    onSearch(searchTerm);
  };

  return (
    <div className="search-container">
      <div className="search-wrapper" ref={searchRef}>
        <input
          type="text"
          className="search-input"
          placeholder="Search Symptoms, Doctors, Specialists, Clinics"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          data-testid="autocomplete-input"
        />
        <svg
          className="search-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={handleSearchIconClick}
        >
          <path
            d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
            stroke="#0063B2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                data-testid="suggestion-item"
              >
                <span>{suggestion.name}</span>
                <span className="doctor-type">{suggestion.specialty}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
