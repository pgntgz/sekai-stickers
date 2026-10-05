import React, { useState, useRef, useEffect } from "react";

export default function EditableNumberTag({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  prefix = "",
  title = "点击直接输入数值",
  className = "",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(String(value));
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isEditing) {
      setTempValue(String(value));
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commitChange = () => {
    let num = parseFloat(tempValue);
    if (isNaN(num)) {
      num = value;
    } else {
      if (typeof min === "number") num = Math.max(min, num);
      if (typeof max === "number") num = Math.min(max, num);
    }
    onChange(num);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitChange();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setTempValue(String(value));
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={`editable-val-wrap editing ${className}`}>
        {prefix && <span className="editable-val-prefix">{prefix}</span>}
        <input
          ref={inputRef}
          type="number"
          min={min}
          max={max}
          step={step}
          className="editable-val-input"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={commitChange}
          onKeyDown={handleKeyDown}
          aria-label={title}
        />
        {unit && <span className="editable-val-unit">{unit}</span>}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`editable-val-tag ${className}`}
      onClick={() => setIsEditing(true)}
      title={`${title} (当前: ${prefix}${value}${unit})`}
      aria-label={`${title} ${prefix}${value}${unit}`}
    >
      <span className="editable-val-text">
        {prefix}{value}{unit}
      </span>
      <svg
        className="editable-val-icon"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    </button>
  );
}
