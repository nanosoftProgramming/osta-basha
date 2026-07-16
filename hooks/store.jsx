import { configureStore } from "@reduxjs/toolkit";
import authorizationReducer from "./authorizationReducer";
import LoacationReducer from "./LoacationSettings";
import Localization from "./Localization";
import countriesRedux from "./Countries";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import providersReducer from "./providers";
import shopsOwnerReducer from "./shopsowners";
import usersReducer from "./users";
import contactListReducer from "./contactList";
import notificationsReducer from "./notificationsReducer";
import adsReducer from './adsReducer'
import categoriesReducer from "./categoriesReducer";
import filterReducer from "./filterationReducer";
import subCategoriesReducer from "./subCategoriesReducer";
import wishlistReducer from "./wishList"
import ProfileReducer from "./ProfileReducer"
import AsyncStorage from '@react-native-async-storage/async-storage';
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ['location', 'authorization', 'Localization', 'contactList'] // نحفظ فقط هذه الـ slices
};

const RootReducers = combineReducers({
  // currentLocal: localizationReducer,
  // ads: adsReducer,
  authorization: authorizationReducer,
  location: LoacationReducer,
  countries: countriesRedux,
    	shopsowners:shopsOwnerReducer,
  	providers:providersReducer,

  	notifications:notificationsReducer,
  	categories:categoriesReducer,
    subCategories:subCategoriesReducer,
  	wishlist:wishlistReducer,
  	// providers:providersReducer,
    contactList:contactListReducer,
    profile:ProfileReducer,
    users:usersReducer,
  	adsReducer:adsReducer,
  // wishlistReducer:wishlistReducer	,
  filterReducer:filterReducer,
  // CategoriesReducer:CategoriesReducer,
  // CountriesReducer:CountriesReducer,
  Localization: Localization
  // lang: langRedux,
});

const persistedReducer = persistReducer(persistConfig, RootReducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

