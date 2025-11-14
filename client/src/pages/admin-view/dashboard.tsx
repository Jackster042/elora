import { useEffect, useState } from "react";

// REDUX
import { RootState, AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { addFeatureImage, getFeatureImage } from "@/store/shop/common-slice";

// COMPONENTS
import { Button } from "@/components/ui/button";
import ProductImageUpload from "@/components/admin-view/image-upload";

const AdminDashboard = () => {
  // IMAGE STATE
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);

  const { featureImageList } = useSelector(
    (state: RootState) => state.commonStore
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleUploadFeatureImage = () => {
    if (uploadedImageUrl) {
      dispatch(addFeatureImage(uploadedImageUrl))
        .unwrap()
        .then((data) => {
          if (data?.payload?.success) {
            dispatch(getFeatureImage());
            setImageFile(null);
            setUploadedImageUrl("");
          }
        })
        .catch(() => {
          // Handle error silently or log to monitoring service
        });
    }
  };

  useEffect(() => {
    dispatch(getFeatureImage());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        file={imageFile}
        setFile={setImageFile}
        url={uploadedImageUrl}
        setUrl={setUploadedImageUrl}
        imageLoadingState={imageLoadingState}
        setImageLoadingState={setImageLoadingState}
        isCustomStyling={true}
        isEditMode={false}
      />
      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div className="relative" key={featureImgItem._id}>
                <img
                  src={featureImgItem.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default AdminDashboard;
