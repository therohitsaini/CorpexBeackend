import { Avatar, Button, Divider, TextField, CircularProgress } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import GradientButton from '../ReuseComponent/ReuseComponent';

function FooterTopBar({ showSnackbar, showError }) {
   const [footerTopBarForm, setFooterTopBarForm] = useState({
      leftSection: {
         title: "",
         subTitle: "",
         icone: "",
         image: null
      },
      rightSection: {
         title: "",
         subTitle: "",
         icone: "",
         image: null
      }
   });

   const [imagePreview, setImagePreview] = useState({
      left: null,
      right: null
   });
   
   const [loading, setLoading] = useState(false);
   const [userId, setUserId] = useState(null);

   useEffect(() => {
      const id = localStorage.getItem("user-ID");
      if (id) {
         setUserId(id);
         getExistingFooterTopBar(id);
      }
   }, []);

   const getExistingFooterTopBar = async (id) => {
      try {
         const url = `${import.meta.env.VITE_BACK_END_URL}api-footer/get-footer-top-bar/${id}`;
         const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
         });
         const data = await response.json();

         if (response.ok && data.data) {
            setFooterTopBarForm({
               leftSection: {
                  title: data.data.leftSection?.title || "",
                  subTitle: data.data.leftSection?.subTitle || "",
                  icone: data.data.leftSection?.icone || "",
                  image: null
               },
               rightSection: {
                  title: data.data.rightSection?.title || "",
                  subTitle: data.data.rightSection?.subTitle || "",
                  icone: data.data.rightSection?.icone || "",
                  image: null
               }
            });

            // Set image previews
            setImagePreview({
               left: data.data.leftSection?.image 
                  ? `${import.meta.env.VITE_BACK_END_URL.replace(/\/$/, '')}/${data.data.leftSection.image.replace(/^\/?/, '')}`
                  : null,
               right: data.data.rightSection?.image 
                  ? `${import.meta.env.VITE_BACK_END_URL.replace(/\/$/, '')}/${data.data.rightSection.image.replace(/^\/?/, '')}`
                  : null
            });
         }
      } catch (error) {
         console.log("Error fetching footer top bar:", error);
      }
   };

   const handleFileChange = (e, section) => {
      const file = e.target.files[0];
      if (!file) return;

      setImagePreview(prev => ({
         ...prev,
         [section]: URL.createObjectURL(file)
      }));

      setFooterTopBarForm((prev) => ({
         ...prev,
         [section === 'left' ? 'leftSection' : 'rightSection']: {
            ...prev[section === 'left' ? 'leftSection' : 'rightSection'],
            image: file
         }
      }));
   };

   const onChangeSection = (e, section) => {
      const { name, value } = e.target;
      setFooterTopBarForm((prev) => ({
         ...prev,
         [section]: {
            ...prev[section],
            [name]: value,
         },
      }));
   };

   const postFooterTopBarData = async () => {
      if (!userId) {
         alert("User ID not found. Please login again.");
         return;
      }

      setLoading(true);
      try {
         const formData = new FormData();
         formData.append("leftTitle", footerTopBarForm.leftSection.title);
         formData.append("leftSubTitle", footerTopBarForm.leftSection.subTitle);
         if (footerTopBarForm.leftSection.image) {
            formData.append("leftImage", footerTopBarForm.leftSection.image);
         }

         formData.append("rightTitle", footerTopBarForm.rightSection.title);
         formData.append("rightSubTitle", footerTopBarForm.rightSection.subTitle);
         if (footerTopBarForm.rightSection.image) {
            formData.append("rightImage", footerTopBarForm.rightSection.image);
         }

         const url = `${import.meta.env.VITE_BACK_END_URL}api-footer/footer-top-bar/${userId}`;
         const response = await fetch(url, {
            method: 'POST',
            body: formData
         });
         const result = await response.json();

         if (response.ok) {
            showSnackbar(result.message || "Footer top bar updated successfully!");
            getExistingFooterTopBar(userId);
         } else {
            showError(result.message || "Failed to update footer top bar");
         }

      } catch (error) {
         console.error("Upload Error:", error);
         showError("An error occurred while saving footer top bar");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className='main h-full w-full flex justify-center items-center flex-col px-30'>
         <div className='form-main gap-3 w-full border border-slate-500/20 p-5'>
            <div className='p-5 w-full flex gap-5'>
               {/* Left Section Form */}
               <form className='border border-slate-500/20 w-full h-full rounded-md p-3 flex flex-col gap-3'>
                  <h1 className='text-lg font-semibold text-gray-700'>Footer Top Left</h1>
                  <Divider sx={{ mb: 1 }} />
                  <div className='button-input flex gap-2 items-center'>
                     <Avatar sx={{ height: 56, width: 56 }} src={imagePreview.left} />
                     <Button
                        sx={{ p: 1, px: 5 }}
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        size='small'
                     >
                        Upload Image
                        <input
                           type="file"
                           hidden
                           accept="image/*"
                           onChange={(e) => handleFileChange(e, 'left')}
                        />
                     </Button>
                  </div>
                  <TextField
                     label="Title"
                     size="small"
                     name="title"
                     value={footerTopBarForm.leftSection.title}
                     onChange={(e) => onChangeSection(e, 'leftSection')}
                     sx={{
                        width: "100%",
                        '& .MuiOutlinedInput-root': {
                           fontSize: '12px',
                           '& input': { fontSize: '14px' },
                           '&:hover fieldset': { borderColor: 'blue' },
                           '&.Mui-focused fieldset': { borderColor: 'blue' },
                        },
                        '& label': { color: 'gray', fontSize: '14px' },
                        '& label.Mui-focused': { color: 'blue' }
                     }}
                     variant="outlined"
                  />
                  <TextField
                     label="Sub Title"
                     size="small"
                     name="subTitle"
                     value={footerTopBarForm.leftSection.subTitle}
                     onChange={(e) => onChangeSection(e, 'leftSection')}
                     sx={{
                        width: "100%",
                        '& .MuiOutlinedInput-root': {
                           fontSize: '12px',
                           '& input': { fontSize: '14px' },
                           '&:hover fieldset': { borderColor: 'blue' },
                           '&.Mui-focused fieldset': { borderColor: 'blue' },
                        },
                        '& label': { color: 'gray', fontSize: '14px' },
                        '& label.Mui-focused': { color: 'blue' }
                     }}
                     variant="outlined"
                  />
               </form>

               {/* Right Section Form */}
               <form className='border border-slate-500/20 w-full h-full rounded-md p-3 flex flex-col gap-3'>
                  <h1 className='text-lg font-semibold text-gray-700'>Footer Top Right</h1>
                  <Divider sx={{ mb: 1 }} />
                  <div className='button-input flex gap-2 items-center'>
                     <Avatar sx={{ height: 56, width: 56 }} src={imagePreview.right} />
                     <Button
                        sx={{ p: 1, px: 5 }}
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        size='small'
                     >
                        Upload Image
                        <input
                           type="file"
                           hidden
                           accept="image/*"
                           onChange={(e) => handleFileChange(e, 'right')}
                        />
                     </Button>
                  </div>
                  <TextField
                     label="Title"
                     size="small"
                     name="title"
                     value={footerTopBarForm.rightSection.title}
                     onChange={(e) => onChangeSection(e, 'rightSection')}
                     sx={{
                        width: "100%",
                        '& .MuiOutlinedInput-root': {
                           fontSize: '12px',
                           '& input': { fontSize: '14px' },
                           '&:hover fieldset': { borderColor: 'blue' },
                           '&.Mui-focused fieldset': { borderColor: 'blue' },
                        },
                        '& label': { color: 'gray', fontSize: '14px' },
                        '& label.Mui-focused': { color: 'blue' }
                     }}
                     variant="outlined"
                  />
                  <TextField
                     label="Sub Title"
                     size="small"
                     name="subTitle"
                     value={footerTopBarForm.rightSection.subTitle}
                     onChange={(e) => onChangeSection(e, 'rightSection')}
                     sx={{
                        width: "100%",
                        '& .MuiOutlinedInput-root': {
                           fontSize: '12px',
                           '& input': { fontSize: '14px' },
                           '&:hover fieldset': { borderColor: 'blue' },
                           '&.Mui-focused fieldset': { borderColor: 'blue' },
                        },
                        '& label': { color: 'gray', fontSize: '14px' },
                        '& label.Mui-focused': { color: 'blue' }
                     }}
                     variant="outlined"
                  />
               </form>
            </div>

            {/* Save Button */}
            <div className='w-full flex justify-end mt-4'>
               <Button
                  onClick={postFooterTopBarData}
                  disabled={loading}
                  sx={{
                     textTransform: 'none',
                     px: 5,
                     backgroundColor: loading ? "#6b6767" : "initial",
                     backgroundImage: loading
                        ? "none"
                        : "linear-gradient(to right, #1e3a8a, #9333ea)",
                     color: "white",
                     "&:hover": {
                        backgroundColor: loading ? "#6b6767" : "initial",
                        backgroundImage: loading
                           ? "none"
                           : "linear-gradient(to right, #1e40af, #7c3aed)",
                     },
                  }}
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} sx={{ color: "#f3f6f7" }} /> : <SaveIcon />}
               >
                  {loading ? 'Saving...' : 'Save All Changes'}
               </Button>
            </div>
         </div>
      </div>
   );
}

export default FooterTopBar; 