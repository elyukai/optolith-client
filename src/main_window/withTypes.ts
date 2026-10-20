import { createAsyncThunk } from "@reduxjs/toolkit"
import type { AppDispatch, RootState } from "./store.ts"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
}>()
