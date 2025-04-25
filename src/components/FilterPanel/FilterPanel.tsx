import { useState } from "react";
import "./FilterPanel.css";

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  specialties: string[];
}

export interface FilterState {
  consultationType: string;
  selectedSpecialties: string[];
  sortBy: string;
}

const FilterPanel = ({ onFilterChange, specialties }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterState>({
    consultationType: "",
    selectedSpecialties: [],
    sortBy: "",
  });

  const handleConsultationTypeChange = (type: string) => {
    const newFilters = { ...filters, consultationType: type };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSpecialtyChange = (specialty: string) => {
    const newSelectedSpecialties = filters.selectedSpecialties.includes(specialty)
      ? filters.selectedSpecialties.filter((s) => s !== specialty)
      : [...filters.selectedSpecialties, specialty];

    const newFilters = { ...filters, selectedSpecialties: newSelectedSpecialties };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <h3 data-testid="filter-header-moc">Consultation Mode</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="consultationType"
              value="Video Consult"
              checked={filters.consultationType === "Video Consult"}
              onChange={(e) => handleConsultationTypeChange(e.target.value)}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          <label>
            <input
              type="radio"
              name="consultationType"
              value="In Clinic"
              checked={filters.consultationType === "In Clinic"}
              onChange={(e) => handleConsultationTypeChange(e.target.value)}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-speciality">Specialties</h3>
        <div className="checkbox-group">
          {specialties?.map((specialty) => (
            <label key={specialty}>
              <input
                type="checkbox"
                checked={filters.selectedSpecialties.includes(specialty)}
                onChange={() => handleSpecialtyChange(specialty)}
                data-testid={`filter-specialty-${specialty?.replace("/", "-") || "unknown"}`}
              />
              {specialty}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-sort">Sort By</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="sortBy"
              value="fees"
              checked={filters.sortBy === "fees"}
              onChange={(e) => handleSortChange(e.target.value)}
              data-testid="filter-sort-fees"
            />
            Fees
          </label>
          <label>
            <input
              type="radio"
              name="sortBy"
              value="experience"
              checked={filters.sortBy === "experience"}
              onChange={(e) => handleSortChange(e.target.value)}
              data-testid="filter-sort-experience"
            />
            Experience
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
