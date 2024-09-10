import { ICommentList } from "@/models/comment";

import CommentCard from "@/components/shared/CommentCard";
import { PaginationComponent } from "@/components/shared/Pagination";

import { useSearchParams } from "react-router-dom";

interface CommentListProps {
  commentList?: ICommentList;
}

const CommentList = ({ commentList }: CommentListProps) => {
  const [searchParams] = useSearchParams();
  if (!commentList) {
    return <div className="p-4">Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-2 p-4">
      {commentList.results.map((comment) => (
        <CommentCard comment={comment} key={comment.id} />
      ))}
      <PaginationComponent
        count={commentList.count}
        next={commentList.next}
        previous={commentList.previous}
        page={Number(searchParams.get("page")) || 1}
      />
    </div>
  );
};

export default CommentList;
