import Link from "next/link";
import PlusIcon from "../Svg/PlusIcon";
import ChildMuiTable from "./ChildMuiTable";




export default function ParentScreen() {
  return (
    <>
     <div className='main_Box'>
        <div className="bread_head">
          <h1 className="content_head">Child MANAGEMENT</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/ChildManagement">Child Management</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
              Child Menu List
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
              <Link href='/AddChild'>
                <button className="btn btn-primary Add_btn">
                  <PlusIcon />
                  ADD CHILD MENU
                </button>
              </Link>
            </div>
          <ChildMuiTable/>
          </div>
        </div>
      </div>
    </>
  );
}

