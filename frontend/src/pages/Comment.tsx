import { type Comment } from "@/models/comment";
import CommentSingleCard from "@/components/shared/CommentSingleCard";

interface CommentProps {
  level?: number;
  comment: Comment;
}

const generateCommentPadding = (level: number) => {
  if (level === 0) {
    return "padding-level-0";
  }
  if (level <= 2) {
    return `padding-level-1`;
  }
  return `padding-level-0`;
};

const Comment = ({ level = 0, comment }: CommentProps) => {
  return (
    <div className={`${generateCommentPadding(level)}`}>
      <div className="flex flex-col gap-2">
        <CommentSingleCard comment={comment} />
        {comment?.replies?.map((reply) => (
          <Comment comment={reply} level={level + 1} key={reply.id} />
        ))}
      </div>
    </div>
  );
};

export default Comment;
