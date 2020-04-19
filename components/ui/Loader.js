import React from 'react';
import { ClassicSpinner } from 'react-spinners-kit';
import styled from 'styled-components';

const LoaderWrapper = styled.div`
    position: absolute;
    display: ${props => props.loading ? 'flex' : 'none'};
    background-color: ${props => props.backgroundColor};
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
`;

export default ({loading = false, color = '#686769', backgroundColor = '#fff4', size = 40}) => (
    <LoaderWrapper loading={loading ? 1 : 0} backgroundColor={backgroundColor}>
        <ClassicSpinner
            loading={loading}
            color={color}
            size={size}
        />
    </LoaderWrapper>
);