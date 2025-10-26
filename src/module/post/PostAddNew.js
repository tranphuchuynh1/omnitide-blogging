import useImgBBUpload from "hooks/useImgBBUpload";
import Toggle from "components/toggle/Toggle";
import slugify from "slugify";
import React, { useEffect, useState, useMemo } from "react";
import ImageUpload from "components/image/ImageUpload";
import { useForm } from "react-hook-form";
import { useAuth } from "contexts/auth-context";
import { toast } from "react-toastify";
import { Radio } from "components/checkbox";
import { postStatus, userRole } from "utils/constants";
import { Label } from "components/label";
import { Input } from "components/input";
import { Field, FieldCheckboxes } from "components/field";
import { Dropdown } from "components/dropdown";
import { db } from "firebase-app/firebase-config";
import { Button } from "components/button";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import DashboardHeading from "module/dashboard/DashboardHeading";
import Swal from "sweetalert2";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import axios from "axios";
import { imgbbAPI } from "config/apiConfig";

Quill.register("modules/imageUploader", ImageUploader);

const PostAddNew = () => {
  const { userInfo } = useAuth();
  const { control, watch, setValue, handleSubmit, getValues, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      slug: "",
      status: 2,
      hot: false,
      image: "",
      content: "",
      category: {},
      user: {},
    },
  });
  const watchStatus = watch("status");
  const watchHot = watch("hot");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Upload image (imgBB)
  const {
    image,
    handleResetUpload,
    progress,
    handleSelectImage,
    handleDeleteImage,
  } = useImgBBUpload(setValue, getValues);

  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      if (!userInfo.email) return;
      const q = query(collection(db, "users"), where("email", "==", userInfo.email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setValue("user", {
          id: doc.id,
          ...doc.data(),
        });
      });
    }
    fetchUserData();
  }, [userInfo.email, setValue]);

  const addPostHandler = async (values) => {
    if (userInfo?.role !== userRole.ADMIN) {
      Swal.fire("Failed", "You have no right to do this action", "warning");
      return;
    }
    setLoading(true);
    try {
      const cloneValues = { ...values };
      cloneValues.slug = slugify(values.slug || values.title, { lower: true });
      cloneValues.status = Number(values.status);
      cloneValues.content = content;

      const colRef = collection(db, "posts");
      await addDoc(colRef, {
        ...cloneValues,
        image,
        createdAt: serverTimestamp(),
      });

      toast.success("Create new post successfully!");
      reset({
        title: "",
        slug: "",
        status: 2,
        category: {},
        hot: false,
        image: "",
        user: {},
        content: "",
      });
      setContent("");
      handleResetUpload();
      setSelectCategory({});
    } catch (error) {
      toast.error("Failed to create post!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getData() {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("status", "==", 1));
      const querySnapshot = await getDocs(q);
      let result = [];
      querySnapshot.forEach((doc) => {
        result.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setCategories(result);
    }
    getData();
  }, []);

  const handleClickOption = async (item) => {
    const colRef = doc(db, "categories", item.id);
    const docData = await getDoc(colRef);
    setValue("category", {
      id: docData.id,
      ...docData.data(),
    });
    setSelectCategory(item);
  };

  // Cấu hình ReactQuill
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["link", "image"],
      ],
      imageUploader: {
        upload: async (file) => {
          const bodyFormData = new FormData();
          bodyFormData.append("image", file);
          const response = await axios({
            method: "post",
            url: imgbbAPI,
            data: bodyFormData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response.data.data.url;
        },
      },
    }),
    []
  );

  return (
    <>
      <DashboardHeading title="Add post" desc="Add new post"></DashboardHeading>
      <form onSubmit={handleSubmit(addPostHandler)}>
        <div className="form-layout">
          <Field>
            <Label>Title</Label>
            <Input control={control} placeholder="Enter your title" name="title" required />
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input control={control} placeholder="Enter your slug" name="slug" />
          </Field>
        </div>

        <div className="form-layout"> <Field> <Label>Image</Label> <ImageUpload onChange={handleSelectImage} handleDeleteImage={handleDeleteImage} className="h-[250px]" progress={progress} image={image} ></ImageUpload> </Field> <Field> <Label>Category</Label> <Dropdown> <Dropdown.Select placeholder="Select the category"></Dropdown.Select> <Dropdown.List> {categories.length > 0 && categories.map((item) => ( <Dropdown.Option key={item.id} onClick={() => handleClickOption(item)} > {item.name} </Dropdown.Option> ))} </Dropdown.List> </Dropdown> {selectCategory?.name && ( <span className="inline-block p-3 text-sm font-medium text-green-600 rounded-lg bg-green-50"> {selectCategory?.name} </span> )} </Field> </div>

        {/* 🧠 Thêm phần nhập nội dung bài viết ngay dưới hình ảnh */}
        <div className="mb-10">
          <Field>
            <Label>Content</Label>
            <div className="w-full entry-content">
              <ReactQuill
                modules={modules}
                theme="snow"
                value={content}
                onChange={setContent}
              />
            </div>
          </Field>
        </div>

        

        <div className="form-layout">
          <Field>
            <Label>Feature post</Label>
            <Toggle on={watchHot === true} onClick={() => setValue("hot", !watchHot)} />
          </Field>
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.APPROVED}
                value={postStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.PENDING}
                value={postStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === postStatus.REJECTED}
                value={postStatus.REJECTED}
              >
                Reject
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>

        <Button type="submit" className="mx-auto w-[250px]" isLoading={loading} disabled={loading}>
          Add new post
        </Button>
      </form>
    </>
  );
};

export default PostAddNew;
