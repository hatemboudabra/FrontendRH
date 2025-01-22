import { createAction, props } from '@ngrx/store';
import { User } from './auth.models';

// Action for login
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: { username: string; password: string } }>()
);

// Action for login success
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

// Action for login failure
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Action for logout
export const logout = createAction('[Auth] Logout');
