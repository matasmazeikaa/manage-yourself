import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import space from '../../images/space-background.jpg';
import alps from '../../images/alps.jpeg';
import park from '../../images/park.jpeg';
import car from '../../images/car.jpg';
import './ThemeGrid.scss';

const backgroundThemeWithImageStyle = {
    backgroundPosition: '50%',
    backgroundSize: 'cover',
    boxShadow: 'none',
};

const themeList = [space, alps, park, car, '#8C2E21', '#050505', '#508BA8', '#031826', '#361D2E'];

const ThemeGrid = ({ dashboardStore }) => {
    const handleThemeSelect = useCallback(
        (theme) => () => {
            const inputName = 'theme';

            dashboardStore.setBoardInput(inputName, theme);
        },
        [dashboardStore],
    );

    return (
        <div className='theme-grid'>
            {themeList.map((theme, index) => {
                if (theme.charAt(0) === '#') {
                    return <div style={{ backgroundColor: theme }} onClick={handleThemeSelect(theme)} key={index}/>;
                }

                return (
                    <div
                        style={{ ...backgroundThemeWithImageStyle, backgroundImage: `url(${theme})` }}
                        onClick={handleThemeSelect(theme)}
                        key={index}
                    />
                );
            })}
        </div>
    );
};

ThemeGrid.propTypes = {
    dashboardStore: PropTypes.object.isRequired,
};

export default observer(ThemeGrid);
