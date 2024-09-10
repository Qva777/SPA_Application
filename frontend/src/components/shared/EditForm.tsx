import { Editor } from "@tinymce/tinymce-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { axiosConfig } from "@/configs/axiosConfig";

import { routes } from "@/routes";

interface EditFormProps {
  contentValue: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

export default function EditForm({ contentValue, setOpen, id }: EditFormProps) {
  const [content, setContent] = useState(contentValue);

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSubmit = async () => {
    const newData = {
      text: content,
    };

    try {
      await axiosConfig.patch(`${routes.COMMENT}/${id}/`, newData);
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex gap-2 px-4 py-8">
      <Editor
        tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js" // CDN version
        initialValue={contentValue}
        init={{
          height: 300,
          width: "100%",
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "preview | undo redo | " + "bold italic | " + "link image code",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        onEditorChange={handleEditorChange}
      />
      <div className="flex justify-end items-center p-4">
        <Button
          onClick={handleSubmit}
          variant={"default"}
          disabled={content === ""}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
