// IMPORTS
import { useRef, useEffect } from "react";
import axios from "axios";

// COMPONENTS
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UploadCloudIcon, FileIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

// HOOKS
import { toast } from "@/hooks/use-toast";

// PROPS TYPES
interface ProductImageUploadProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  url: string | null;
  setUrl: React.Dispatch<React.SetStateAction<string | null>>;
  imageLoadingState: boolean;
  setImageLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
  isEditMode: boolean;
  isCustomStyling: boolean;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  file,
  setFile,
  setUrl,
  imageLoadingState,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const uploadImageToCloudinary = async () => {
    try {
      setImageLoadingState(true);
      const data = new FormData();
      if (file) {
        data.append("my_file", file);
      }

      const response = await axios.post(
        "http://localhost:3001/api/admin/products/upload-image",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.success) {
        setUrl(response?.data?.result?.url);
        setImageLoadingState(false);
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      } else {
        setImageLoadingState(false);
        toast({
          title: "Error",
          description: response?.data?.message || "Failed to upload image",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setImageLoadingState(false);
      console.error(error, "error from uploadImageToCloudinary");
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (file !== null) uploadImageToCloudinary();
  }, [file]);

  return (
    <section
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">
        Upload Product Image
      </Label>
      <div
        className="border border-b rounded-md"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Input
          type="file"
          id="image-upload"
          className="hidden"
          disabled={isEditMode}
          ref={inputRef}
          onChange={handleFileChange}
        />
        {!file ? (
          <Label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center h-32 cursor-pointer ${
              isEditMode && "cursor-not-allowed"
            }`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag and drop or click to upload your image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileIcon className="w-10 h-10 text-muted-foreground mb-2" />
              <span>{file.name}</span>
            </div>
            <Button variant="ghost" onClick={handleRemoveFile}>
              Remove
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductImageUpload;
