import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CameraIcon from '../Svg/CameraIcon';
import { Baseurl, filesUrl } from "../../Utils/Constants";
import { toast } from "react-toastify";
import { getCookie, hasCookie } from 'cookies-next';
import axios from "axios";

export default function EditProfileScreen({ setEditMode, userData }) {
    const sideView = useSelector((state) => state.sideView.value);
    const dbMode = useSelector((state) => state.dbMode.value);
    const [userInfo, setUserInfo] = useState(userData)
    const [errorData, setErrorData] = useState({})
    const [imgMode, setImgMode] = useState('3');
    const [imgFile, setImgFile] = useState('');
    const [userImage, setuserImage] = useState('');

    const UploadImgFun = (e) => {
        let ImagesArray = Object.entries(e.target.files).map((e) =>
            URL.createObjectURL(e[1])
        );
        userInfo.client_logo = ImagesArray[0]
        setuserImage(e.target.files)
        setImgFile(ImagesArray);
    }

    const checkCurrentImg = () => {
        if (imgFile) {
            setImgMode('1')
        } else {
            setImgMode('2')
        }
    }

    console.log(userImage);
    async function UpdateprofileHandle() {

        if (hasCookie('saLsTkn')) {
            if (userInfo.password) {
                if (!userInfo.conPassword) {
                    return setErrorData({ ...errorData, conPassword: 'Confirm your Password' })
                } else if (userInfo.password !== userInfo.conPassword) {
                    return setErrorData({ ...errorData, conPassword: 'Password Does not match' })
                }
            }
            const token = getCookie('saLsTkn');
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                }
            }
            try {
                const res = await axios.post(Baseurl + `/db/admin/profile`, userInfo, header);
                if (res.status === 200 || res.status === 204) {
                    toast.success('Profile Updated Successfully')
                    if (userImage) {
                        AddUploadPicture(userData.user_id, 'adminProfile', userImage[0], userInfo.profile_img)
                    }
                    setEditMode(false)
                }

            } catch (error) {
                if (error?.response?.data?.status === 422) {
                    const taskObject = {}
                    const array = error?.response?.data?.data;
                    for (let i = 0; i < array.length; i++) {
                        const key = Object.keys(array[i])[0];
                        const value = Object.values(array[i])[0];
                        taskObject[key] = value;
                    }

                    setErrorData(taskObject);
                }
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                }
                else {
                    toast.error('Something went wrong!')
                }

            }
        }

    }

    const AddUploadPicture = async (id, path, file, name) => {
        console.log(userImage[0]);
        if (hasCookie('saLsTkn')) {
            let token = (getCookie('saLsTkn'));

            var formdata = new FormData();
            formdata.append("path", path);
            formdata.append("user_id", id);
            formdata.append("file", file);
            if (name || name !== null) {
                formdata.append("_imageName", name);
            }
            else {
                formdata.append("_imageName", 0);
            }

            var requestOptions = {
                method: 'PUT',
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                },
                body: formdata,
                redirect: 'follow'
            }

            fetch(Baseurl + `/db/admin/profile`, requestOptions)
                .then(response => response.text())
                .then(result => {
                    toast.info(result.message)
                })
                .catch(error => console.log('error', error));
        }

        return
    }


    useEffect(() => {
        checkCurrentImg();
    }, [userInfo.user_image_file, imgFile]);

    return (
        <>
            <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h1 className="content_head">PROFILE</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href={dbMode == 'admin' ? '/Admin' : '/'}>Home</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Profile
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="Add_user_screen">
                        <div className="add_screen_head">
                            <span className="text_bold">Fill Details</span> ( * Fields are
                            mandatory)
                        </div>
                        <div className="add_user_form">
                            <div className="row">
                                <div className="col-xl-2 col-md-4 col-sm-12 col-12">
                                    <div className="img_sec">
                                        <label htmlFor="uploadImg" title='Upload Logo'>
                                            {imgMode === '1' ? <img src={imgFile} alt="logo" width='100%' /> : null}
                                            {imgMode === '2' ? <> {userInfo.profile_img ?
                                                <img src={`${filesUrl}/adminProfile/images${userInfo.profile_img}`} alt="logo" width='100%' /> :
                                                <>
                                                    <div className="img_holder">
                                                        <img src="/images/add_user_avatar.png" alt="" />
                                                        <div className="icon">
                                                            <CameraIcon />
                                                        </div>
                                                    </div></>}</> : null}

                                        </label>
                                        <input type="file" id='uploadImg' accept="image/png, image/gif, image/jpeg" onChange={UploadImgFun} />
                                    </div>

                                </div>
                                <div className="col-xl-10 col-md-8 col-sm-12 col-12">
                                    <div className="row mx-xl-2">
                                        <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                            <div className={errorData?.user ? 'input_box errorBox' : 'input_box'}>
                                                <label htmlFor="first_name">Name *</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter First Name"
                                                    name="first_name"
                                                    id="first_name"
                                                    className={errorData?.user ? 'form-control is-invalid' : 'form-control'}
                                                    onChange={(e) => {
                                                        setUserInfo({ ...userInfo, user: e.target.value })
                                                        setErrorData({ ...errorData, user: '' })
                                                    }}
                                                    value={userInfo.user ? userInfo.user : ""} />
                                                <span className="errorText"> {errorData?.user ? errorData.user : ''}</span>
                                            </div>
                                        </div>

                                        <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                            <div className={errorData?.contact_number ? 'input_box errorBox' : 'input_box'}>
                                                <label htmlFor="Contact">Contact No *</label>
                                                <input
                                                    type="number"
                                                    name="contact"
                                                    placeholder="Enter Contact No. "
                                                    id="Contact"
                                                    className={errorData?.contact_number ? 'form-control is-invalid' : 'form-control'}
                                                    onChange={(e) => {
                                                        setUserInfo({ ...userInfo, contact_number: e.target.value })
                                                        setErrorData({ ...errorData, contact_number: '' })
                                                    }}
                                                    value={userInfo.contact_number ? userInfo.contact_number : ""} />
                                                <span className="errorText"> {errorData?.contact_number ? errorData.contact_number : ''}</span>
                                            </div>
                                        </div>

                                        <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                            <div className={errorData?.email ? 'input_box errorBox' : 'input_box'}>
                                                <label htmlFor="Email">Email Id *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Enter Email Id"
                                                    id="Email"
                                                    className={errorData?.email ? 'form-control is-invalid' : 'form-control'}
                                                    onChange={(e) => {
                                                        setUserInfo({ ...userInfo, email: e.target.value })
                                                        setErrorData({ ...errorData, email: '' })
                                                    }}
                                                    value={userInfo.email ? userInfo.email : ""} />
                                                <span className="errorText"> {errorData?.email ? errorData.email : ''}</span>
                                            </div>
                                        </div>

                                        <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                            <div className={errorData?.password ? 'input_box errorBox' : 'input_box'}>
                                                <label htmlFor="password">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    placeholder="Enter Password"
                                                    id="password"
                                                    className={errorData?.password ? 'form-control is-invalid' : 'form-control'}
                                                    onChange={(e) => {
                                                        setUserInfo({ ...userInfo, password: e.target.value })
                                                        setErrorData({ ...errorData, password: '' })
                                                    }}
                                                    value={userInfo.password ? userInfo.password : ""} />
                                                <span className="errorText"> {errorData?.password ? errorData.password : ''}</span>
                                            </div>
                                        </div>
                                        <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                            <div className={errorData?.conPassword ? 'input_box errorBox' : 'input_box'}>
                                                <label htmlFor="confirmpassword">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    name="confirmpassword"
                                                    placeholder="Confirm Password"
                                                    id="confirmpassword"
                                                    className={errorData?.conPassword ? 'form-control is-invalid' : 'form-control'}
                                                    onChange={(e) => {
                                                        setUserInfo({ ...userInfo, conPassword: e.target.value })
                                                        setErrorData({ ...errorData, conPassword: '' })
                                                    }}
                                                    value={userInfo.conPassword ? userInfo.conPassword : ""} />
                                                <span className="errorText"> {errorData?.conPassword ? errorData.conPassword : ''}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-end">
                                <div className="submit_btn">
                                    <button className="btn btn-cancel me-2" onClick={() => setEditMode(false)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={UpdateprofileHandle}>  Update </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
