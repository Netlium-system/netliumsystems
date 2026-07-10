export interface AuthActionState {
  readonly error: string | null;
  readonly success: boolean;
}

export const initialAuthActionState: AuthActionState = {
  error: null,
  success: false
};
