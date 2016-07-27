import request from 'superagent';
import { browserHistory } from 'react-router';
import firebase from 'firebase';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const REQUEST_GIFS = 'REQUEST_GIFS';
export const FETCH_FAVORITED_GIFS = 'FETCH_FAVORITED_GIFS';
export const SIGN_IN_USER = 'SIGN_IN_USER';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const AUTH_ERROR = 'AUTH_ERROR';

const API_URL = 'http://api.giphy.com/v1/gifs/search?q=';
const API_KEY = '&api_key=dc6zaTOxFJmzC';

// const ref = new Firebase('https://react-gif-search-dbc40.firebaseio.com/'); // Outdated Firebase ref

const config = {
    apiKey: "AIzaSyBjeJqgDKQWne2QMDHiy8EvoLQRNhDkbtA",
    authDomain: "react-gif-search-dbc40.firebaseapp.com",
    databaseURL: "https://react-gif-search-dbc40.firebaseio.com",
    storageBucket: "react-gif-search-dbc40.appspot.com",
};

firebase.initializeApp(config);

const rootRef = firebase.database().ref();

export function requestGifs(term = null) {
  return function(dispatch) {
    request.get(`${API_URL}${term.replace(/\s/g, '+')}${API_KEY}`).then(response => {
      dispatch({
        type: REQUEST_GIFS,
        payload: response
      });
    });
  }
}

function getUser() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('User: ',user);
            return user;
        } else {
            console.log('User not found');
            return false;
        }
    });
}

export function favoriteGif({selectedGif}, uid) {
    console.log('favoritegif', selectedGif, uid);
  const userRef = rootRef.child(uid);
  const gifId = selectedGif.id;

  return dispatch => userRef.update({
    [gifId]: selectedGif
  });
}

export function unfavoriteGif({selectedGif}, uid) {
    console.log('UNfavoritegif', selectedGif, uid);
  const userRef = rootRef.child(uid);
  const gifId = selectedGif.id;

  return dispatch => userRef.child(gifId).remove();
}

export function fetchFavoritedGifs(uid) {
  return function(dispatch) {
  const userRef = rootRef.child(uid);
    userRef.on('value', snapshot => {
      dispatch({
        type: FETCH_FAVORITED_GIFS,
        payload: snapshot.val()
      })
    });
  }
}

export function openModal(gif) {
  return {
    type: OPEN_MODAL,
    gif
  }
}

export function closeModal() {
  return {
    type: CLOSE_MODAL
  }
}

export function signUpUser(credentials)
{
  return function(dispatch) {
    firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then (function(userData) {
            dispatch(signInUser(credentials));
        })
        .catch(function(error) {
            dispatch(authError(error));
        });



  }
}

export function signInUser(credentials) {
    return function(dispatch) {
        firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
            .then (function(authData) {
                    dispatch({
                        type: SIGN_IN_USER,
                        payload: authData.uid
                    });

                    browserHistory.push('/favorites');
            })
            .catch(function(error) {
                    dispatch(authError(error));
            });
    }
}

export function authenticateUser() {
    return function (dispatch) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log('User logged in');
                dispatch({
                    type: SIGN_IN_USER,
                    payload: user.uid
                });
                browserHistory.push('/favorites');
            } else {
                console.log('User not logged in');
                dispatch(signOutUser());
            }
        });

    }
}

export function signOutUser() {
    browserHistory.push('/');

    return {
        type: SIGN_OUT_USER
    }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}
