import Link from "next/link";
export default function AddSub_2Product() {
  return (
    <div className='main_Box'>
    <div className="bread_head">
        <h3 className="content_head">ADD Product Category </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
            {}
              <Link href="/ManageSub_2Product">Product Management</Link>
            </li>

            <li className="breadcrumb-item active" aria-current="page">
              Add Product Category
            </li>
          </ol>
        </nav>
      </div>

      <div className="main_content">
        <div className="Add_user_screen">
          <div className="add_screen_head">
            <span className="text_bold">Add Category</span>
          </div>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="task_name">Product Category</label>
                  <input
                    type="text"
                    placeholder="Enter Product Category "
                    name="task_name"
                    id="task_name"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-xl-12 col-md-12 col-sm-12 col-12"/>
              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="task_name">Product Sub Category</label>
                  <input
                    type="text"
                    placeholder="Enter Product Category "
                    name="task_name"
                    id="task_name"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-xl-12 col-md-12 col-sm-12 col-12"/>
              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="task_name">Product Sub Category-1</label>
                  <input
                    type="text"
                    placeholder="Enter Product Category "
                    name="task_name"
                    id="task_name"
                    className="form-control"
                  />
                </div>
              </div>
              

              <div className="text-end">
            <div className="submit_btn">
              
              <button className="btn btn-primary">Save & Submit</button>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
