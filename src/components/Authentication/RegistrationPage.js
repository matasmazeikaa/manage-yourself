import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { useStore } from '../../hooks/useStore';
import { resolveError } from '../../utils/error-resolver';
import { useStyles } from './AuthenticationStyles';

const Register = ({ history }) => {
    const classes = useStyles();
    const { authorizationStore } = useStore();

    const register = useCallback(
        async (event) => {
            event.preventDefault();

            const [res, err] = await authorizationStore.register();

            if (!err) {
                history.push('/dashboard/boards');

                return;
            }

            const errors = resolveError(err);

            authorizationStore.setErrors(errors);
        },
        [authorizationStore, history],
    );

    const goToLogin = useCallback(
        (event) => {
            event.preventDefault();
            history.push('/registration');
        },
        [history],
    );

    return (
        <Grid container component='main' className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Register
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={register}>
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            name='username'
                            label='Username'
                            type='username'
                            onChange={authorizationStore.handleAuthorizationInput}
                            error={!!authorizationStore.errors.username}
                            helperText={authorizationStore.errors.username}
                            autoFocus
                        />
                        <TextField
                            variant='outlined'
                            margin='normal'
                            required
                            fullWidth
                            label='Email Address'
                            name='email'
                            autoFocus
                            onChange={authorizationStore.handleAuthorizationInput}
                            error={!!authorizationStore.errors.email}
                            helperText={authorizationStore.errors.email}
                        />
                        <TextField
                            variant='outlined'
                            margin='normal'
                            fullWidth
                            name='password'
                            label='Password'
                            type='password'
                            autoComplete='current-password'
                            onChange={authorizationStore.handleAuthorizationInput}
                            error={!!authorizationStore.errors.password}
                            helperText={authorizationStore.errors.password}
                        />
                        <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit} loading>
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href='#' onClick={goToLogin} variant='body2'>
                                    {'Don\'t have an account? Sign Up'}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};

Register.propTypes = {
    history: PropTypes.object.isRequired,
};

export default observer(Register);
