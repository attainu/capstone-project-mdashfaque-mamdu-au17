import { toast } from "react-toastify";

const logOut = {
  fulfilled: (state, action) => {
    state.user = {
      name: null,
      email: null,
      profilePicURL: null,
      createdPosts: [],
      readingList: [],
      likedPosts: [],
      followers: [],
      following: [],
      _id: null,
    };
    toast.info("You Signed Out!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  },
  rejected: (state, action) => {},
  pending: (state, action) => {},
};

export default logOut;
