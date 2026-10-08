import React, { useState, useRef, useEffect } from "react";
import "@mdui/icons/edit--rounded.js";

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
      <mdui-icon-edit--rounded class="editable-val-icon" />
    </button>
  );
}
