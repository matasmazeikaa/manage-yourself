import React from 'react';
import PropTypes from 'prop-types';
import './NotFoundPage.scss';
import Button from '@material-ui/core/Button';

const NotFoundPage = ({ history }) => (
    <>
        <div className='fullPage' />
        <div className='not-found'>
            <h1>PAGE NOT FOUND 404</h1>
            <Button type='submit' fullWidth variant='contained' color='primary' onClick={() => history.push('/login')}>
                Go to login :)
            </Button>
        </div>
    </>
);

NotFoundPage.propTypes = {
    history: PropTypes.object.isRequired,
};

export default NotFoundPage;
