import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
	name: 'auth',
	initialState: { userInfo: {} },
	reducers: {
		updateUserInfo: (state, action) => {
			state.userInfo = action.payload;
		}
	}
});

export const {updateUserInfo} = authSlice.actions;

export default authSlice.reducer;
