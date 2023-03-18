import { configureStore } from '@reduxjs/toolkit';
import auth from './auth';

const store = configureStore({
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false
		}),
	reducer: { auth }
});

export default store;
