import React from 'react';
import classNames from 'classnames';
import ReactSelect from 'react-select';
/**
 * Single select
 */
export default function Select({
  value,
  options = [],
  isSearchable = false,
  isClearable = false,
  onChange=function(){},
  className,
  getOptionValue=(opt) => opt.value,
  ...props
}) {
  const onValueChange = (value) => onChange(getOptionValue(value), value);
  const filteredProps = {...props, ...{isMulti: false}};

  let selected;

  if (value) {
    selected = options.findIndex(option => getOptionValue(option) == value);
  }

  return (
    <div className={className}>
      <ReactSelect
        isMulti={false}
        clearValue={onValueChange}
        value={value && selected > -1 ? options[selected] : null}
        options={options}
        onChange={onValueChange}
        isSearchable={isSearchable}
        isClearable={isClearable}
        getOptionValue={getOptionValue}
        {...filteredProps}
        classNamePrefix="react-select"
        className={"react-select-container"}
      />
    </div>
  );
}