import { legacy_createStore as createStore, combineReducers } from 'redux'
import { CollApsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['LoadingReducer'] // 将不需要持久化的数据加入黑名单
}
const reducer = combineReducers({
  CollApsedReducer,
  LoadingReducer
})
const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)
export { store, persistor }
