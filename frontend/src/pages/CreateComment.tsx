import { Editor } from "@tinymce/tinymce-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import {axiosConfig } from "@/configs/axiosConfig";
import { routes } from "@/routes";

const INITIALTEXTVALUE = "<p>This is the initial content of the editor</p>";

const CreateComment = () => {
  const [content, setContent] = useState(INITIALTEXTVALUE);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [homepage, setHomepage] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSubmit = async () => {
    if (inputCaptcha !== captcha) {
      setError("Invalid CAPTCHA");
      return;
    }

    if (content.trim() === "" || content === INITIALTEXTVALUE) {
      setError("Content cannot be empty");
      return;
    }

    setError("");

    const newData = {
      username: name,
      email,
      homepage,
      text: content,
      parent: searchParams.get("id") || null,
    };

    try {
      const response = await axiosConfig.post(routes.CREATE_COMMENT, newData);
      const data = response.data;
      setName("");
      setEmail("");
      setHomepage("");
      setContent(INITIALTEXTVALUE);
      setInputCaptcha("");
      generateCaptcha();
      navigate(`${routes.COMMENT}/${searchParams.get("parent") || data.id}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 px-4 py-8">
        <div className="w-48">
          <p>User Name:</p>
        </div>
        <Input
          placeholder="Enter your name"
          value={name}
          required
          maxLength={50}
          onChange={(e) => setName(e.target.value)}
          className="w-96"
        />
      </div>
      <div className="flex gap-2 border px-4 py-8">
        <div className="w-48">
          <p>Email:</p>
        </div>
        <Input
          placeholder="Enter your email"
          required
          maxLength={50}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-96"
        />
      </div>
      <div className="flex gap-2 border px-4 py-8">
        <div className="w-48">
          <p>Home Page:</p>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <p>Currently:</p>
              {homepage ? (
                <a href={homepage} target="_blank" rel="noreferrer">
                  {homepage}
                </a>
              ) : (
                <span>Not set</span>
              )}
            </div>
            <div className="flex gap-2 justify-center items-center">
              <p>Change:</p>
              <Input
                placeholder="Enter your homepage"
                value={homepage}
                onChange={(e) => setHomepage(e.target.value)}
                className="w-96"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 px-4 py-8">
        <div className="w-48">
          <p>Text:</p>
        </div>
        <Editor
          tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js" // CDN version
          initialValue={INITIALTEXTVALUE}
          init={{
            height: 500,
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
      </div>

      <div className="flex gap-2 px-4 py-8">
        <div className="w-48">
          <p>CAPTCHA:</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-gray-200 p-2 rounded">{captcha}</span>
          <Input
            placeholder="Enter the CAPTCHA"
            value={inputCaptcha}
            onChange={(e) => setInputCaptcha(e.target.value)}
            className="w-96"
          />
        </div>
      </div>

      {error && <div className="text-red-500 px-4">{error}</div>}
      <div className="flex justify-end items-center p-4">
        <Button
          onClick={handleSubmit}
          variant={"default"}
          disabled={
            name === "" || email === "" || content.trim() === "" || content === INITIALTEXTVALUE || inputCaptcha === ""
          }
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default CreateComment;



