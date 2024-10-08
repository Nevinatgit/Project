// jsonSlice.js
import { createSlice } from '@reduxjs/toolkit';

const jsonSlice = createSlice({
  name: 'json',
  initialState: {
    jsonObject: {},
    jsonArray: [],
    New:false,
    Insert:false,
    Save:false,
    I:false,
    error:true,
    total:0
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    setJsonObject: (state, action) => {
      state.jsonObject = action.payload;
    },
    setJsonArray: (state, action) => {
      state.jsonArray = action.payload;
    },
    setNew: (state,action)=>{
        state.New=action.payload
    },
    setI: (state,action)=>{
        state.I=action.payload
    },
    setSave: (state,action)=>{
        state.Save=action.payload
    }
  },
});

export const { setJsonObject, setJsonArray,setInsert,setNew,setSave,setI,setError,setTotal } = jsonSlice.actions;
export default jsonSlice.reducer;
