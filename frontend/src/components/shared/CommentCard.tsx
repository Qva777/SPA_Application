import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Armchair, CloudUpload, Download, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { routes } from "@/routes";
import { IComment } from "@/models/comment";

interface ICommentCardProps {
  comment: IComment;
}

export default function CommentCard({ comment }: ICommentCardProps) {
  const div = document.createElement("div");
  div.innerHTML = comment.text;

  const plainText = div.textContent || div.innerText || "";
  const shortText = plainText.slice(0, 150);

  return (
    <Card>
      <CardHeader>
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
      </CardHeader>
      <CardContent>
        <p>
          {shortText}
          {plainText.length > 20 && "..."}
        </p>
      </CardContent>
    </Card>
  );
}
