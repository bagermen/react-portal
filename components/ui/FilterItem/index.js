import React from 'react';
import styled from 'styled-components';

const FilterItem = styled.div`
    box-shadow: 1px 1px 2px 0 ${props => props.color};
    background-color: ${props => props.color};
    padding: 5px 10px 5px;
    position: relative;
    opacity: 0.8;
    cursor: pointer;
    margin: 0 10px 10px 10px;

    &:hover {
      opacity: 1;
    }

    ::before {
      content: "";
      position: absolute;
      right: 100%;
      top: 0;
      width: 0;
      height: 0;
      border-top: 14px solid transparent;
      border-right: 10px solid ${props => props.color};
      border-bottom: 14px solid transparent;
    }
`;

const TickButton = styled.i`
  position: relative;
  top: 0;
  left: -8px;
  transition: color 0.3s ease;
  &:hover {
    color: ${props => props.crossHoverColor};
  }
`;

/**
 * control panel
 */
export default ({className, name, filterId, crossHoverColor = '#202b34', color = 'grey', onRemove, ...props}) => {
  return (
    <FilterItem
      className={className}
      data-filter={filterId.toString()}
      color={color}
      onClick={onRemove}
      {...props}
    >
      <TickButton
        className="fa fa-times"
        aria-hidden="true"
        crossHoverColor={crossHoverColor}>
      </TickButton>
      {name}
    </FilterItem>
  );
}