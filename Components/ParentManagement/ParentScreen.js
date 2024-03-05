import Link from "next/link";
import PlusIcon from "../Svg/PlusIcon";
import ParentMuiTable from "./ParentMuiTable";
import { useSelector } from "react-redux";


export default function ParentScreen() {
  const sideView = useSelector((state) => state.sideView.value);

  return (
    <>
       <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h1 className="content_head">PARENT MANAGEMENT</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/Parent">Parent Management</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Parent List
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
              <Link href='/AddParent'>
                <button className="btn btn-primary Add_btn">
                  <PlusIcon />
                  ADD PARENT MENU
                </button>
              </Link>
            </div>


          <ParentMuiTable/>
          </div>
        </div>
      </div>
    </>
  );
}
