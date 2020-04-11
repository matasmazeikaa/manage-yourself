import React, { useRef, useEffect } from 'react';
import PropType from 'prop-types';

const OutsideClickHandler = ({ children, onOutsideClick, isContainerOpen }) => {
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (isContainerOpen && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                onOutsideClick();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isContainerOpen, onOutsideClick]);

    return <div ref={wrapperRef}>{children}</div>;
};

OutsideClickHandler.propTypes = {
    children: PropType.node.isRequired,
    onOutsideClick: PropType.func.isRequired,
    isContainerOpen: PropType.bool.isRequired,
};

export default OutsideClickHandler;
