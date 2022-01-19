import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import cloudinaryUpload from "../Utils/cloudinaryUpload";

export const getUser = createAsyncThunk("user/get", async () => {
  let url = "/auth/login/success";
  let options = { credentials: "include" };
  let { data } = await axios.get(url, options);
  return data;
});


export const postArticle = createAsyncThunk(
  "user/article/post",
  async (articleObj, { getState }) => {
    const { file, title, summary, articleBody, category } = articleObj;
    const _id = getState().user._id;
    const postObj = {
      title: title,
      summary: summary,
      body: articleBody,
      author: _id,
      likes: 0,
      thumbnailURL: "",
      tags: category.length !== 0 ? category.split(",") : [],
      comments: [],
    };

    if (file) {
      const { secure_url } = await cloudinaryUpload(file);
      postObj.thumbnailURL = secure_url;
    }

    let { data } = await axios.post("/user/article/post", postObj);
    return data
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: null,
    email: null,
    profilePicURL: null,
    createdPosts: [],
    readingList: [],
    likedPosts: [],
    followers: [],
    following: [],
    _id: null,
  },
  reducers: {
    login: (state, action) => {
      const provider = action.payload;
      window.open(`http://localhost:5000/auth/${provider}`, "_self");
    },
    logout: () => {
      window.open("http://localhost:5000/auth/logout", "_self");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.fulfilled, (state, action) => {
      if (!action.payload.error) {
        const {
          name,
          email,
          profilePicURL,
          createdPosts,
          readingList,
          likedPosts,
          followers,
          following,
          _id,
        } = action.payload.user;
        state.name = name;
        state.email = email;
        state.profilePicURL = profilePicURL;
        state.createdPosts = createdPosts;
        state.readingList = readingList;
        state.likedPosts = likedPosts;
        state.followers = followers;
        state.following = following;
        state._id = _id;
      }
    });
    builder.addCase(postArticle.fulfilled, (state, action) => {
      state.createdPosts.push(action.payload)
    });
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
