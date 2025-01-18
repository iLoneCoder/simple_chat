import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import authService from "./authService"
import { jwtDecode } from "jwt-decode"

const USER = JSON.parse(localStorage.getItem("user"))

const initialState = {
    user: USER ? jwtDecode(USER.token) : null,
    isError: false,
    isSuccess: false,
    isLoading: true,
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


export const logout = createAsyncThunk("auth/logout", () => {
    return authService.logout()
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
            // state.isLoading = false
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
            .addCase(logout.pending, (state) => {
                state.isLoading = true
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
                state.isLoading = false
                state.isSuccess = true
            })
    }
})

export const { reset } = authSlice.actions
export default authSlice.reducer