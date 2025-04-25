import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import "./DoctorList.css";
import SearchBar from "../SearchBar/SearchBar";
import FilterPanel, { FilterState } from "../FilterPanel/FilterPanel";

interface Doctor {
  id: number;
  name: string;
  specialties: string[];
  experience: number;
  fee: number;
  consultationType: string;
  qualification?: string;
  clinicName?: string;
  location?: string;
  imageUrl?: string;
}

const DoctorList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [filters, setFilters] = useState<FilterState>({
    consultationType: searchParams.get("consultationType") || "",
    selectedSpecialties: searchParams.get("specialties")?.split(",").filter(Boolean) || [],
    sortBy: searchParams.get("sortBy") || "",
  });

  const specialties = useMemo(() => {
    if (!doctors || doctors.length === 0) return [];
    const allSpecialties = doctors.flatMap((doctor) => doctor.specialties || []);
    return Array.from(new Set(allSpecialties)).sort();
  }, [doctors]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch doctors: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setDoctors(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const updateURLParams = (newFilters: FilterState, newSearchTerm: string) => {
    const params = new URLSearchParams();
    if (newSearchTerm) params.set("search", newSearchTerm);
    if (newFilters.consultationType) params.set("consultationType", newFilters.consultationType);
    if (newFilters.selectedSpecialties.length > 0) {
      params.set("specialties", newFilters.selectedSpecialties.join(","));
    }
    if (newFilters.sortBy) params.set("sortBy", newFilters.sortBy);
    setSearchParams(params);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    updateURLParams(filters, term);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    updateURLParams(newFilters, searchTerm);
  };

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doctor) => {
        if (searchTerm && !doctor.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        if (filters.consultationType && doctor.consultationType !== filters.consultationType) {
          return false;
        }
        if (
          filters.selectedSpecialties.length > 0 &&
          !doctor.specialties.some((specialty) => filters.selectedSpecialties.includes(specialty))
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "fees") {
          return a.fee - b.fee;
        } else if (filters.sortBy === "experience") {
          return b.experience - a.experience;
        }
        return 0;
      });
  }, [doctors, searchTerm, filters]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (doctors.length === 0) return <div className="no-doctors">No doctors found</div>;

  return (
    <div className="doctor-list-container">
      <div className="search-section">
        <SearchBar doctors={doctors} onSearch={handleSearch} />
      </div>
      <div className="content-section">
        <div className="filter-section">
          <FilterPanel onFilterChange={handleFilterChange} specialties={specialties} />
        </div>
        <div className="doctor-cards">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} data-testid="doctor-card" className="doctor-card">
              <img
                src={doctor.imageUrl || "https://via.placeholder.com/80"}
                alt={doctor.name}
                className="doctor-image"
              />
              <div className="doctor-info">
                <h3 data-testid="doctor-name" className="doctor-name">
                  {doctor.name}
                </h3>
                <p data-testid="doctor-specialty" className="doctor-specialty">
                  {doctor.specialties?.join(", ") || "No specialties listed"}
                </p>
                <p className="doctor-qualification">{doctor.qualification || "MBBS"}</p>
                <p data-testid="doctor-experience" className="doctor-experience">
                  {doctor.experience} yrs exp.
                </p>
                <div className="clinic-info">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 8.5C9.10457 8.5 10 7.60457 10 6.5C10 5.39543 9.10457 4.5 8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 7.60457 6.89543 8.5 8 8.5Z"
                      stroke="#666666"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13 6.5C13 11 8 14.5 8 14.5C8 14.5 3 11 3 6.5C3 3.46243 5.23858 1 8 1C10.7614 1 13 3.46243 13 6.5Z"
                      stroke="#666666"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{doctor.clinicName || "Clinic"}</span>
                  <span>{doctor.location || "Location"}</span>
                </div>
              </div>
              <div data-testid="doctor-fee" className="fee-info">
                ₹{doctor.fee}
              </div>
              <button className="book-appointment">Book Appointment</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
