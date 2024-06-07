import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import { useRouter } from "next/router";

const EmailConfigScreen = () => {
  const router=useRouter()
  const sideView = useSelector((state) => state.sideView.value);
  const [formData, setFormData] = useState({
    email_config_id:"",
    host: "",
    port: "", 
    user: "",
    password: "",
    from: ""
  });



  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    if (hasCookie("token")) {
      const token = getCookie("token");
      const db_name = getCookie("db_name");

      const header = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          db: db_name,
          m_id: 79,
        },
      };

      try {
        const response = await axios.post(`${Baseurl}/db/emailConfig`,formData, header);
        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message);
        router.push("/")
        }
      } 
      catch (error) {
        console.log(error)
        if (error?.response?.data?.status === 422) {
              toast.error(error?.response?.data?.message)
              
        }
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
          router.push("/")
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const getEmailConfig = async (queryObjLeads) => {

    if (hasCookie('token')) {
        let token = (getCookie('token'));
        let db_name = (getCookie('db_name'));

        let header = {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer ".concat(token),
                db: db_name,
                m_id: 76,
            }
        }

        try {
            const {data} = await axios.get(Baseurl + `/db/emailConfig`,header);
            setFormData({
              ...formData,
              email_config_id:data?.data[0]?.email_config_id,
              host:data?.data[0]?.host,
              port:data?.data[0]?.port,
              user:data?.data[0]?.user,
              password:data?.data[0]?.password,
              from:data?.data[0]?.from,
            })
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        }
    }
}

const updateEmailConfig = async (e) => {
  e.preventDefault();
  console.log(formData)
  if (hasCookie("token")) {
    const token = getCookie("token");
    const db_name = getCookie("db_name");

    const header = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        db: db_name,
        m_id: 79,
      },
    };

    try {
      const response = await axios.put(`${Baseurl}/db/emailConfig`,formData, header);
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message);
        router.push("/")
      }
    } 
    catch (error) {
      console.log(error)
      if (error?.response?.data?.status === 422) {
            toast.error(error?.response?.data?.message)
            
      }
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  }
};

  useEffect(()=>{
      getEmailConfig()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className={`main_Box ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">EMAIL CONFIGURATION</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Email Configuration
            </li>
          </ol>
        </nav>
      </div>
      <div className="main_content">
        <div className="container py-5">
          <form onSubmit={(e)=>{
            formData?.email_config_id ? updateEmailConfig(e) : handleSubmit(e)
          }}>
            {[
              { id: "host", type: "text", label: "Host Name", value: formData.host },
              { id: "port", type: "number", label: "Port Number", value: formData.port},
              { id: "user", type: "email", label: "User Email", value: formData.user },
              { id: "password", type: "password", label: "Password", value: formData.password },
              { id: "from", type: "email", label: "From Email", value: formData.from },
            ].map(({ id, type, label, value }) => (
              <div key={id} className="mb-3 col-xl-6 col-lg-6 col-12">
                <label htmlFor={id} className="form-label">{label} *</label>
                <input
                  type={type}
                  className="form-control"
                  id={id}
                  placeholder={`Enter ${label}`}
                  value={value}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div className="mt-4 col-xl-6 col-lg-6 col-12 d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">
              {formData?.email_config_id ? 'Update' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailConfigScreen;