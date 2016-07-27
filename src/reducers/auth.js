import { SIGN_IN_USER, SIGN_OUT_USER, AUTH_ERROR } from '../actions';

const initialState =  {
  authenticated: false,
  uid: null,
  error: null
};

export default function gifs(state = initialState, action) {
    switch (action.type) {
        case SIGN_IN_USER:
            return {
                ...state,
                authenticated: true,
                uid: action.payload,
                error: null
            };
        case SIGN_OUT_USER:
            return {
                ...state,
                authenticated: false,
                uid: null,
                error: null
            };
        case AUTH_ERROR:
          return {
            ...state,
            error: action.payload.message
          };
        default:
            return state;
    }
}
