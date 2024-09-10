import { useParams } from "react-router-dom";
import { axiosConfig } from "@/configs/axiosConfig";
import { useEffect, useState } from "react";

import { routes } from "@/routes";

import { type Comment } from "@/models/comment";
import CommentPage from "@/pages/Comment";

const CommentFetch = () => {
  const { id } = useParams();
  const [commentData, setCommentData] = useState<Comment>();

  useEffect(() => {
    const fetchComment = async () => {
      const response = await axiosConfig.get(`${routes.COMMENT}/${id}/`);
      const data = response.data;
      setCommentData(data);
    };
    fetchComment();
  }, [id]);

  if (!commentData) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className=" p-4">
      <CommentPage comment={commentData} />
    </div>
  );
};

export default CommentFetch;



