import Field from "./base/field";
import field from "./any-field.module.css";
import classes from "./searchable-select.module.css";
import { cn } from "../lib/utils";
import { InputHTMLAttributes, useState } from "react";
import useComponentVisible from "../hooks/use-component-visible";

interface SearchableSelectProps extends InputHTMLAttributes<HTMLInputElement> {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  id: string;
  name?: string;
  labelText?: string;
  error?: false | string[] | null | undefined | string;
  dropdownItems: {
    id: number;
    title: string;
  }[];
  handleSelect?: (title: string) => void;
  handleChange?: () => void;
}

export default function SearchableSelect({
  searchValue,
  setSearchValue,
  id,
  name = id,
  labelText = id,
  error,
  dropdownItems,
  className,
  handleSelect,
  handleChange,
  ...props
}: SearchableSelectProps) {
  const searchResults = dropdownItems.filter((item) =>
    item.title.includes(searchValue)
  );

  const [showResults, setShowResults] = useState(false);

  const { ref, isComponentVisible } = useComponentVisible<HTMLDivElement>();

  return (
    <Field
      id={id}
      labelText={labelText}
      error={error}
      className={classes.field}
    >
      <input
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.currentTarget.value);
          if (typeof handleChange === "function") {
            handleChange();
          }
        }}
        name={name}
        id={id}
        type="text"
        onFocus={() => setShowResults(true)}
        onBlur={() => setShowResults(false)}
        className={cn([
          field.input,
          error && field["input--error"],
          classes.input,
          className,
        ])}
        {...props}
      />
      <div
        className={classes["dropdown-wrapper"]}
        hidden={!showResults && !isComponentVisible}
        ref={ref}
      >
        <ul className={classes.dropdown} aria-live="polite">
          {searchResults.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setSearchValue(item.title);
                  if (typeof handleSelect === "function") {
                    handleSelect(item.title);
                  }
                }}
                type="button"
              >
                {item.title}
              </button>
            </li>
          ))}
          {searchValue.length > 2 &&
            !searchResults.some((result) => result.title == searchValue) && (
              <p style={{ marginBottom: "0.5rem" }}>
                proceed to create {searchValue}
              </p>
            )}
        </ul>
      </div>
    </Field>
  );
}
