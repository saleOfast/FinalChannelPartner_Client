import Link from "next/link";
import PlusIcon from "../Svg/PlusIcon";
import Sub_2ProductTab from "./Sub_2ProductTab";

export default function SubProductScreen() {
  return (
    <>
     <div className='main_Box'>
        <div className="bread_head">
          <h1 className="content_head">PRODUCT MANAGEMENT</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/ManageSubProduct">Product Management List</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Add Product Category
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
              <Link href="/AddSub_2ProductList">
                <button className="btn btn-primary Add_btn">
                  <PlusIcon />
                  ADD PRODUCT CATEGORY
                </button>
              </Link>
            </div>

           <Sub_2ProductTab />
          </div>
        </div>
      </div>
    </>
  );
}
