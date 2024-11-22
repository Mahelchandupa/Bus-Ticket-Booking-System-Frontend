import { useEffect, useRef, useState } from "react";
import { FaChevronUp } from "react-icons/fa";

const SearchableDropDown = ({
  label,
  id,
  error,
  isError = false,
  name,
  value,
  options = [],
  defaultOption,
  idKey,
  valueKey,
  containerStyle,
  labelStyle,
  dropdownDivStyle,
  dropdownStyle,
  errorDropdownStyle,
  dropDownIconStyle,
  errorTextStyle,
  disabled = false,
  onChange,
  onBlur,
  placeholder,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [filteredOptions, setFilteredOptions] = useState(options || []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  console.log("options", options);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setFilteredOptions(
      newValue === ""
        ? options // Show all options if input is empty
        : options.filter((option) =>
            option[valueKey].toLowerCase().includes(newValue.toLowerCase())
          )
    );
    setIsDropdownOpen(true);
    onChange && onChange({ target: { name, value: newValue } });
  };

  const handleOptionSelect = (option) => {
    setInputValue(option[valueKey]);
    setFilteredOptions(options); // Reset options to show all on reopen
    setIsDropdownOpen(false);
    onChange &&
      onChange({
        target: { name, value: option[valueKey], id: option[idKey] },
      });
  };

  return (
    <div className={`${containerStyle || "w-full"}`} ref={dropdownRef}>
      <label
        htmlFor={id}
        className={` text-[14px] leading-[22px] font-Inter font-medium text-gray-700 block ${labelStyle}`}
      >
        {label}
      </label>
      <div className={`relative mt-2 ${dropdownDivStyle}`}>
        <input
          onBlur={onBlur}
          onChange={handleInputChange}
          value={inputValue}
          name={name}
          id={id}
          placeholder={placeholder}
          onFocus={handleInputFocus}
          disabled={disabled}
          className={`cursor-pointer placeholder:text-gray-400 mt-2 flex items-center px-5 appearance-none w-full h-[40px] font-sans text-[14px]  text-[#3C3C43] border-[1px]  focus:border-teal-500 focus:outline-none rounded-[4px] ${
            isError ? " border-red-500" : "border-[#CDD1DE]"
          }`}
        />
        <div
          className={`absolute inset-y-0 right-2 flex items-center px-2 pointer-events-none ${dropDownIconStyle}`}
        >
          {/* <img src={dropdownIcon} alt="dropdown" /> */}
          <FaChevronUp
            className={`w-4 h-4 transform transition-transform duration-300 text-[#C8CAD8] ${
              isDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border-[1px] border-[#CDD1DE] border-b-0 overflow-x-hidden rounded-md ">
            <ul className="max-h-[250px] overflow-y-scroll ">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option[idKey]}
                    onClick={() => handleOptionSelect(option)}
                    className="cursor-pointer font-Inter text-[14px] text-[#3C3C43] hover:bg-blue-100 hover:text-blue-700 px-5 flex items-center h-[35px] border-b-[1px] border-[#CDD1DE]"
                  >
                    {option[valueKey]}
                  </li>
                ))
              ) : (
                <li className="text-gray-500 px-5 flex items-center justify-center h-[40px] border-b-[1px] border-[#CDD1DE] ">
                  No results found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {isError && error && (
        <p
          className={`text-error-red text-[12px] mt-1 font-Inter ${errorTextStyle}`}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default SearchableDropDown;
