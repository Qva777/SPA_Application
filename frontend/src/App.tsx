import { Route, Routes } from "react-router-dom";
import { routes } from "./routes";

import { type ICommentList } from "./models/comment";

import CommentList from "./pages/CommentList";
import CommentFetch from "./components/shared/CommentFetch";
import CreateComment from "./pages/CreateComment";

import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosConfig, setAuthToken } from "./configs/axiosConfig";


function App() {
  const [comments, setComments] = useState<ICommentList>();
  const [searchParams] = useSearchParams();

  useEffect(() => {

    const token = localStorage.getItem("accessToken");
    setAuthToken(token);

    const fetchComments = async () => {
      let page = Number(searchParams.get("page")) || 1;
      const totalPagesResponse = await axiosConfig.get(
        `${routes.COMMENTS_LIST}/?page=1`
      );
      const totalPagesData = totalPagesResponse.data;
      if (page > totalPagesData.total_pages) {
        page = totalPagesData.total_pages;
      }
      const response = await axiosConfig.get(
        `${routes.COMMENTS_LIST}/?page=${page}`
      );
      const data = response.data;
      setComments(data);
    };
    fetchComments();
  }, [searchParams]);
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route
          path={routes.COMMENTS_LIST}
          element={<CommentList commentList={comments} />}
        />
        <Route path={`${routes.COMMENT}/:id`} element={<CommentFetch />} />
        <Route path={routes.CREATE_COMMENT} element={<CreateComment />} />
      </Route>
    </Routes>
  );
}

export default App;
