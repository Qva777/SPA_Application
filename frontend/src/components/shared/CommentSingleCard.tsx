import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Armchair,
  CloudUpload,
  Download,
  Hash,
  Pen,
  Trash,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { routes } from "@/routes";
import { IComment } from "@/models/comment";
import { Button } from "../ui/button";
import { axiosConfig } from "@/configs/axiosConfig";
import { useEffect, useState } from "react";
import EditForm from "./EditForm";

interface ICommentCardProps {
  comment: IComment;
}
const CommentSingleCard = ({ comment }: ICommentCardProps) => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const handleReply = () => {
    navigate(`${routes.CREATE_COMMENT}?id=${comment.id}&parent=${id}`);
  };
  const handleEdit = () => {
    setOpen(!open);
  };
  const handleDelete = async () => {
    await axiosConfig.delete(`${routes.COMMENT}/${comment.id}/`);
    if (comment.parent) {
      window.location.reload();
    } else {
      navigate(routes.COMMENTS_LIST);
    }
  };

  useEffect(() => {
    const fetchPreview = async () => {
      const response = await axiosConfig.get(
        `${routes.COMMENT}/${comment.parent}/`
      );
      const data: IComment = response.data;
      const div = document.createElement("div");
      div.innerHTML = data.text;

      const plainText = div.textContent || div.innerText || "";
      const shortText = plainText.slice(0, 100);
      setPreview(shortText);
    };
    fetchPreview();
  }, []);

  return (
    <Card id={comment.id}>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://www.pngitem.com/pimgs/m/575-5759580_anonymous-avatar-image-png-transparent-png.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Link to={`${routes.COMMENT}/${comment.id}`}>
              <CardTitle>{comment.username}</CardTitle>
            </Link>
            <span>{new Date(comment.created_at).toLocaleDateString()}</span>
            <div className="flex gap-2">
              <Link to="#" className=" text-blue-500">
                <Hash size={12} />
              </Link>
              <Link to="#" className=" text-blue-500">
                <Download size={12} />
              </Link>
              <Link to="#" className=" text-blue-500">
                <Armchair size={12} />
              </Link>
              <Link to="#" className=" text-blue-500">
                <CloudUpload size={12} />
              </Link>
            </div>
          </div>
          <div>
            <div className="flex gap-2">
              <Button variant={"ghost"} onClick={handleEdit}>
                <Pen size={12} />
              </Button>
              <Button variant={"ghost"} onClick={handleDelete}>
                <Trash size={12} />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {open ? (
          <EditForm
            contentValue={comment.text}
            setOpen={setOpen}
            id={comment.id}
          />
        ) : (
          <>
            {preview && (
              <a
                className="text-sm border-l-2 border-blue-500 bg-blue-200 p-2"
                href={`#${comment.parent}`}
              >
                {preview}...
              </a>
            )}
            <p
              className="pt-4"
              dangerouslySetInnerHTML={{ __html: comment.text }}
            />
            <div className="flex justify-end">
              <Button onClick={handleReply}>Reply</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentSingleCard;
