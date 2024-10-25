import { getCookie, hasCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Baseurl } from "../../../Utils/Constants";
import axios from "axios";
import { Table } from "react-bootstrap";
import moment from "moment";

const AgencyClientCostSheet = ({ id }) => {
  const [agencySiteLists, setAgencySiteLists] = useState([]);

  const getAgencySites = async (id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: "pass",
        },
      };
      try {
        const response = await axios.get(
          Baseurl +
            `/db/media/costSheet/clientCostSheet/getAgencyCostSheetsData?estimate_id=${id}`,
          header
        );
        setAgencySiteLists(response?.data?.data);
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  useEffect(() => {
    if (id) {
      getAgencySites(id);
    }
  }, [id]);

  const totals = agencySiteLists.reduce(
    (acc, site) => {
      acc.display += site.selling_price_as_per_duration || 0;
      acc.printing += site.printing_cost || 0;
      acc.mounting += site.mounting_cost || 0;
      return acc;
    },
    { display: 0, printing: 0, mounting: 0 }
  );

  return (
    <>
      <div className="add_screen_head">
        <span className="text_bold">Client Cost Sheet</span>
      </div>
      <div className="add_user_form">
        <div className="row ">
          {agencySiteLists?.length > 0 ? (
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Site Code</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Location</th>
                  <th>Media Format</th>
                  <th>Media Vehicle</th>
                  <th>Media Type</th>
                  <th>Quantity</th>
                  <th>Width (Ft.)</th>
                  <th>Height (Ft.)</th>
                  <th>Total (Sq. Ft.)</th>
                  <th>Campaign Start Date</th>
                  <th>Campaign End Date</th>
                  <th>Campaign Duration</th>
                  <th>Display Cost / Month</th>
                  <th>Selling Price as per Duration</th>
                  <th>Final Client PO Cost</th>
                  <th>Mounting Cost / Sq. Ft.</th>
                  <th>Mounting Cost</th>
                  <th>Printing Cost / Sq. Ft.</th>
                  <th>Printing Cost</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {agencySiteLists?.map((site, index) => (
                  <tr key={site.site_id}>
                    <td>{index + 1}</td>
                    <td
                    // style={{ color: "blue", textDecoration: "underline", textDecorationColor: "blue" }}
                    >
                      {/* <Link href={`/media/AddSites?id=${site.site_id}&vw=md`}> */}
                      {site?.site_code}
                      {/* </Link> */}
                    </td>

                    <td>{site?.state}</td>
                    <td>{site?.city}</td>
                    <td>{site?.location}</td>
                    <td>{site?.media_format}</td>
                    <td>{site?.media_vehicle}</td>
                    <td>{site?.media_type}</td>
                    <td>{site?.quantity}</td>
                    <td>{site?.height}</td>
                    <td>{site?.width}</td>
                    <td>{site?.total_sq_ft}</td>
                    <td>
                      {moment(site?.campaign_start_date).format("DD/MM/YYYY")}
                    </td>
                    <td>
                      {moment(site?.campaign_end_date).format("DD/MM/YYYY")}
                    </td>
                    <td>
                      {moment(site?.campaign_end_date).diff(
                        moment(site?.campaign_start_date),
                        "days"
                      )}
                    </td>
                    <td>{site?.display_cost_per_month}</td>
                    <td>
                      {Number(site?.selling_price_as_per_duration).toFixed(2)}
                    </td>
                    <td>{site?._client_po_cost}</td>
                    <td>{site?.mounting_cost_per_sq_ft}</td>
                    <td>{Number(site?.mounting_cost).toFixed(2)}</td>
                    <td>{site?.printing_cost_per_sq_ft}</td>
                    <td>{Number(site?.printing_cost).toFixed(2)}</td>
                    <td>{site?.remarks}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: "bold" }}>
                  <td colSpan={15}></td>
                  <td>Total</td>
                  <td>{totals.display.toFixed(2)}</td>
                  <td colSpan={2}></td>
                  <td>{totals.mounting.toFixed(2)}</td>
                  <td colSpan={1}></td>
                  <td>{totals.printing.toFixed(2)}</td>
                </tr>
              </tfoot>
            </Table>
          ) : (
            <p>No sites available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AgencyClientCostSheet;
