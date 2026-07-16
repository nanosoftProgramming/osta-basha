import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    filter: [{}],
  },
  reducers: {
    filterData: (state, action) => {
      const currentFilter = state.filter[0] || {};
      let newFilterPart = {};

      if (Array.isArray(action.payload)) {
        newFilterPart = Object.assign({}, ...action.payload);
      } else if (typeof action.payload === 'object' && action.payload !== null) {
        newFilterPart = action.payload;
      }

      state.filter = [{ ...currentFilter, ...newFilterPart }];
    },
    clearFilters: (state) => {
  state.filter = [{}];
}
  },
});


export const { filterData,clearFilters } = filterSlice.actions;
export default filterSlice.reducer;
