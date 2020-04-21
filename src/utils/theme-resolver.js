const backgroundThemeWithImageStyle = {
    backgroundPosition: '50%',
    backgroundSize: 'cover',
    boxShadow: 'none',
};

export const urlOrColor = (theme) => {
    if (theme.charAt(0) === '#') {
        return { backgroundColor: theme, ...backgroundThemeWithImageStyle };
    }

    return { backgroundImage: `url(${theme})`, ...backgroundThemeWithImageStyle };
};
