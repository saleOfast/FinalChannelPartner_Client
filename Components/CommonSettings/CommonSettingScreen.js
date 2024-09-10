import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";
import Select from "react-select";
import { Baseurl } from "../../Utils/Constants";
import { useRouter } from "next/router";



const CommonSettingScreen = () => {
  const router = useRouter();
  const sideView = useSelector((state) => state.sideView.value);
  const [formData, setFormData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [currencyList, setCurrencyList] = useState([]);
  const [roleList, setRoleList] = useState([]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) =>
      prevFormData.map((data) =>
        data.setting_name === id ? { ...data, setting_value: value } : data
      )
    );
  };

  const handleSelectChange = (selectedOption, setting_name) => {
    setFormData((prevFormData) =>
      prevFormData.map((item) =>
        item.setting_name === setting_name
          ? { ...item, setting_value: selectedOption ? selectedOption.value : '' }
          : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const getCommonSettings = async () => {
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
        setFormData(data?.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const getCurrencyList = async () => {
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
          Baseurl + `/db/settings/generalSettings/getCurrencies`,
          header
        );
        setCurrencyList(data?.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const getRoleList = async () => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          db: db_name,
          pass:"pass"
        },
      };

      try {
        const { data } = await axios.get(
          Baseurl + `/db/role`,
          header
        );
        let mediaRoles=data?.data?.filter((item)=>item.role_id==4 || item.role_id==7)
        const array=[]
       for(let i=0;i<mediaRoles.length;i++){
          let a={
            value:mediaRoles[i].role_id,
            label:mediaRoles[i].role_name
          }
          array.push(a)
       }
        setRoleList(array)
        
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const updateCommonSettings = async (e, setting_id) => {
    e.preventDefault();
    const settingToUpdate = formData.find(item => item.setting_id === setting_id);
    console.log(formData)
    if (settingToUpdate && hasCookie("token")) {
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
          `${Baseurl}/db/settings/generalSettings`,
          {
            setting_id: settingToUpdate.setting_id,
            setting_value: settingToUpdate.setting_value
          },
          header
        );
        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message);
        }
      } catch (error) {
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


  const handleMultiSelectChange = (selectedOptions, setting_name) => {
    
    const selectedRoleIds = selectedOptions.map(option => option.value).join(",");
    setFormData((prevFormData) =>
      prevFormData.map((item) =>
        item.setting_name === setting_name
          ? { ...item, setting_value: selectedRoleIds }
          : item
      )
    );
  };
 

  useEffect(() => {
    getCommonSettings();
    getCurrencyList();
    getRoleList();
  }, []);

  return (
    <div className={`main_Box ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">COMMON SETTINGS</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/crm">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Common Settings
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
                onSubmit={(e) => updateCommonSettings(e, data?.setting_id)}
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
                        {data?.setting_name === "visit_date_validation" && (
                          <input
                            type="number"
                            className="form-control mt-1 mt-md-0"
                            id={data?.setting_name}
                            placeholder={`Enter ${data?.setting_name}`}
                            value={Number(data?.setting_value)}
                            onChange={handleChange}
                            required
                          />
                        )}
                        {data?.setting_name === "Currency" && (
                          <select
                          id={data?.setting_name}
                          className="form-select mt-1 mt-md-0"
                          value={data?.setting_value || ''}
                          onChange={(e) => handleSelectChange({ value: e.target.value }, data?.setting_name)}
                        >
                          <option value="">Select {data?.setting_name}</option>
                          {currencyList.map((currency) => (
                            <option key={currency.currency_id} value={currency.currency_id}>
                              {currency?.country_name+"-"+currency?.code}
                            </option>
                          ))}
                        </select>
                        )}
                        {
                          data?.setting_name === "Roles For Approval of Estimates" && (
                            <>
                               <Select
                            isMulti
                            value={roleList.filter(role => data?.setting_value?.split(',').includes(role.value.toString()))}
                            options={roleList.map((role) => ({
                              value: role.value,
                              label: role.label,
                            }))}
                            onChange={(selectedOptions) =>{
                              
                               handleMultiSelectChange(selectedOptions, data.setting_name)}}
                            className="basic-multi-select mt-1 mt-md-0" 
                            classNamePrefix="select"
                            placeholder={`Select ${data?.setting_name}`}
                          />
                            </>
                          )
                        }
                      </div>
                      <div className="" style={{ marginTop: "30px" }}>
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
