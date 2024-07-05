import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import { useRouter } from "next/router";

const CommonSettingScreen = () => {
  const router = useRouter();
  const sideView = useSelector((state) => state.sideView.value);
  const [formData, setFormData] = useState([]);
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) =>
      prevFormData.map((data) =>
        data.setting_name === id ? { ...data, setting_value: value } : data
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
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
        const response = await axios.post(
          `${Baseurl}/db/emailConfig`,
          formData,
          header
        );
        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message);
          router.push("/");
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.status === 422) {
          toast.error(error?.response?.data?.message);
        }
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
          router.push("/");
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const getEmailConfig = async () => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          db: db_name,
          m_id: 76,
        },
      };

      try {
        const { data } = await axios.get(
          Baseurl + `/db/settings/generalSettings`,
          header
        );
        setFormData(data?.data); // Assuming `data` is an object with a `data` property which is an array
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const updateEmailConfig = async (e, setting_id,setting_value) => {
    e.preventDefault();
    console.log(setting_id);
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
        const response = await axios.put(
          `${Baseurl}/db/settings/generalSettings`,{
            setting_id:setting_id,
            setting_value:setting_value
          },
          header
        );
        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message);
          
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.status === 422) {
          toast.error(error?.response?.data?.message);
        }
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  useEffect(() => {
    getEmailConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`main_Box ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">EMAIL CONFIGURATION</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/crm">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Email Configuration
            </li>
          </ol>
        </nav>
      </div>
      <div className="main_content">
        <div className="container py-5">
          {formData.length > 0 &&
            formData.map((data) => (
              <form
                key={data?.setting_id}
                onSubmit={(e) => {
                  data?.setting_id
                    ? updateEmailConfig(e, data?.setting_id,data?.setting_value)
                    : handleSubmit(e);
                }}
              >
                <div className="row">
                  <div className="mb-3 col-xl-9 col-lg-9 col-9">
                    <div className="d-flex align-items-center gap-2">
                      <div>
                        <label
                          htmlFor={data?.setting_name}
                          className="form-label"
                        >
                          {data?.setting_name} *
                        </label>
                        <input
                          type="number"
                          className="form-control mt-1 mt-md-0"
                          id={data?.setting_name}
                          placeholder={`Enter ${data?.setting_name}`}
                          value={Number(data?.setting_value)}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div
                        className=""
                        style={{ marginTop: "30px" }}
                      >
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          style={{ height: "40px" }}
                        >
                          {data?.setting_id ? "Update" : "Submit"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CommonSettingScreen;
