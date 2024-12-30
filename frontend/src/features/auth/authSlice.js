import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "./authService"

const USER = JSON.parse(localStorage.getItem("user"))

const initialState = {
    user: USER ? USER : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}


export const login = createAsyncThunk("auth/login", async (auth, thunkAPI) => {
    try {
        return await authService.login(auth)
    } catch (error) {
        const message = error.response.data.message
        
        return thunkAPI.rejectWithValue(message)
    }
})

//TODO signup
//TODO logout

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false
            state.isSuccess = false
            state.message = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(login.rejected, (state, action) => {
                state.message = action.payload
                state.isError = true
                state.isLoading = false
            })
    }
})

export const { reset } = authSlice.actions
export default authSlice.reducer